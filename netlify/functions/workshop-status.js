/* eslint-disable no-console */
const Amplitude = require('@amplitude/node');
const Sentry = require('@sentry/serverless');

// eslint-disable-next-line import/no-unresolved
const config = require('./util/config');

const amplitudeClient = Amplitude.init(process.env.AMPLITUDE_API_KEY);
const analyticsToken = process.env.ANALYTICS_TOKEN;

Sentry.AWSLambda.init({
  dsn: process.env.SENTRY_DSN_ANALYTICS,
  environment: config.context,
  tracesSampleRate: 1.0,
});

exports.handler = Sentry.AWSLambda.wrapHandler(async (event) => {
  if (
    !event.queryStringParameters ||
    event.queryStringParameters.token !== analyticsToken
  ) {
    console.error('Missing query params, unauthorized');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Not authorized' }),
    };
  }
  const { body } = event;
  const jsonbody = JSON.parse(body);
  const workshopEvent = jsonbody.event;

  const eventProperties = {
    workshopEventType: workshopEvent.workshop,
    workshopName: workshopEvent.name,
  };
  if (!workshopEvent.data) {
    eventProperties.percentageComplete = 0.00;
  } else {
    const completion = (workshopEvent.step / workshopEvent.total)
    eventProperties.percentageComplete = completion.toFixed(2);
  }
  amplitudeClient.logEvent({
    event_type: 'workshop event',
    user_id: workshopEvent.user,
    event_properties: eventProperties,
  });

  // Send any events that are currently queued for sending.
  // Will automatically happen on the next event loop.
  const statussend = amplitudeClient.flush();
  return {
    statusCode: 200,
    body: JSON.stringify({ sent: statussend }),
  };
});
