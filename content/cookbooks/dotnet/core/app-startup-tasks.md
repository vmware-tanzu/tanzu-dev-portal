+++
categories = [".NET Core", "ASP.NET"]
tags = [".net", "entity framework", "ef core", "migrations", "cf task"]
summary = "Recipe Summary"
title = "Bootstrapping with CF Task"
date = 2019-01-22T14:54:55-06:00
+++


## Summary
CF Tasks provide a mechanism for executing processes that don't qualify as long running and are best suited for execution within a CF environment.  Some cononical examples of operations well suited for CF Tasks are:

    - Database migrations
    - Data export or backup
    - Batch processing
    - Optimizations (index maintenance, etc)

One might conclude, based on the above examples, that CF Tasks are the perfect mechanism for bootstrapping an application (for instance, creating the backing DB required for an app to run prior to the app actually running).  While possible, bootstrapping via CF Task requires some special consideration in how we `cf push`, as described in further detail below.

## When to use this recipe

If you're planning on using CF Tasks for boostrapping your application, this recipe is for you.

## Overview
Why do we need special consideration when bootstrapping our app using CF Tasks?  

Imagine a scenario where we want to accomplish the following:

  1. Push our app without starting it
  2. Execute tasks within our app dedicated to bootstrapping our environment
  3. Once all tasks have been comlpeted, we want to start our app

We craft the below script in support of our goals, which at first glance looks correct:

```
# push without starting
cf push MyApp --no-start

# run some bootstrapping tasks to prepare our app to run...
cf run-task MyApp "/home/vcap/app/MyApp -- task=db-migrate" --name MyTask

# Wait for task to complete (code excluded for brevity ...)

# start accepting requests...
cf start MyApp
```

If our app has never been pushed before, the above script will fail with `cf run-task` reporting `App Not Staged: MyApp`.  You'll find the only way to eliminate this error is to remove the `--no-start` from our `cf push`, but without the bootstrapping we need before app startup, we're guaraunteed a crash by any instance of our app that starts.  

Why is this happening, and how can we escape this vicious cycle?

#### CF Push
`cf push` is a command that orchestrates a multi-step process.  One of the steps that `cf push` carries out is initiating the `staging` of an app in Cloud Foundry.  If an app is pushed with the `--no-start` argument `cf push` will upload the app without starting it, which can be helpful when executing blue-green or green-field deploys.  An unfortunate side effect of pushing an app with `--no-start` is that the app is not `staged`.

#### CF Task
CF Tasks don't require that our application is running, however, the underlying implementation of CF Tasks does require that our application is `staged`.  This is because each time a task is run a short-lived instance of our app is spun up for the occasion.  When the task completes the container supporting the instance is destroyed.  If our app isn't `staged` there's nothing available to inject into a container for supporting the transient instance that actually runs the task and `cf run-task` fails appropriately.  

Now that we understand why `cf run-task` fails if we push via `cf push --no-start`, we can understand the solution detailed below.

### Solution
Revisiting our initial goals, let's get a little more specific on what we really want:

  1. Push our app without any instances starting before bootstrapping
  2. Execute tasks within our app dedicated to bootstrapping.
  3. Once all tasks have been comlpeted, we want our app instance(s) to start.



#### Push Zero Instances

In order to accomplish step one outlined above, a build script can execute the following:

```
cf push MyApp -i 0
cf stop MyApp
```

The above steps will result in our app being pushed and staged, but the `-i 0` argument tells Cloud Foundry to scale zero instances of our app.  Immediately after our push we stop the app to prevent the `gorouter` from sending requests to zero running instances.  

#### Execute Tasks
To run a task for an application we can invoke `cf run-task [AppName] -- [args]`.  To view tasks running for a given app we can run `cf tasks [AppName]`.  Given the above commands we can script a solution that executes the tasks we need to bootstrap our environment.  We can add to that script the ability to wait until tasks are complete by checking the output of `cf tasks`.  

```
cf run-task MyApp "/home/vcap/app/MyApp -- task=db-migrate" --name Task1

# loop until output of cf-tasks MyApp shows Task1 as SUCCEEDED
TASK_RESULT=$(cf tasks MyApp | grep Task1 | awk '{ print $3 }')
while [[ $TASK_RESULT != "SUCCEEDED" ]]; do
    if [[ $TASK_RESULT == "FAILED" ]]; then
        echo "Task reported failure.  Check logs."
        exit 1	
    fi
    # wait and check again
    sleep 1
    TASK_RESULT=$(cf tasks MyApp | grep Task1 | awk '{ print $3 }')
done
```

#### Start Instance(s)
Once all tasks have been executed and their completion verified, we can scale our app back to a non-zero number of instances and formally start the app.

```
cf scale MyApp -i 1
cf start MyApp
```

#### Sample Script
The below bash script accomplishes our goals as outlined above; an app is pushed without starting any instances, a task is executed and watched until completion, and once the task completes our app starts at least one instance.

This script goes a step further by collecting the number of instances currently running if the app has been deployed before.  This way, when our push is over, the app is restored to the same scaling specification it had prior to our push.  If this was our first push of the app, it will be scaled to a single instance:

```
#!/bin/bash

APP_NAME="MyApp"
APP_ASSEMBLY_NAME="MyApp"
CONFIGURED_INSTANCE_COUNT=$(((cf scale $APP_NAME || true) | grep -Poe "(?<=instances: )[\d]+") || echo 0)
if [[ $CONFIGURED_INSTANCE_COUNT -eq 0 ]]; then
    CONFIGURED_INSTANCE_COUNT=1
fi
cf push -i 0
cf stop $APP_NAME || true

MIGRATION_TASK="dbMigration_$(date +%s)"
echo "Starting migration task $MIGRATION_TASK ..."

cf run-task $APP_NAME "/home/vcap/app/$APP_ASSEMBLY_NAME -- task=db-migrate" --name $MIGRATION_TASK

function SetMigrationResult() {
	eval "$1=$(cf tasks $APP_NAME | grep $MIGRATION_TASK | awk '{ print $3 }')"
}

TIME_LIMIT=30
TIME_INTERVAL=1
TIMER=0
TIME_REMAINING=$TIME_LIMIT
MIGRATION_RESULT=''
SetMigrationResult MIGRATION_RESULT

while [[ $MIGRATION_RESULT != "SUCCEEDED" ]]; do
	if [ $TIMER -ge $TIME_LIMIT ]; then
		echo "Timed out waiting for migration to complete."
		exit 1
	fi 
	SetMigrationResult MIGRATION_RESULT
	if [[ $MIGRATION_RESULT == "FAILED" ]]; then
		echo "Migration reported failure.  Check logs."
		exit 1
	fi
	let TIME_REMAINING=$TIME_LIMIT-$TIMER
	echo "Waiting for migration to complete ($TIME_REMAINING seconds before timeout...)"
	sleep $TIME_INTERVAL
	let TIMER=$TIMER+$TIME_INTERVAL	
	SetMigrationResult MIGRATION_RESULT 
done	
if [[ $MIGRATION_RESULT == "SUCCEEDED" ]]; then
  echo $MIGRATION_TASK completed in $TIMER seconds...
fi

echo Successfully performed database update

cf scale $APP_NAME -i $CONFIGURED_INSTANCE_COUNT
cf start $APP_NAME
```


  