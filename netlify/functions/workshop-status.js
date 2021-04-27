/* eslint-disable no-console */
const Amplitude = require('@amplitude/node');
const Sentry = require('@sentry/serverless');

// eslint-disable-next-line import/no-unresolved
const config = require('./util/config');

const amplitudeKey =
  config.context === 'production'
    ? process.env.PROD_AMPLITUDE_API_KEY
    : process.env.DEV_AMPLITUDE_API_KEY;

const amplitudeClient = Amplitude.init(amplitudeKey);
const analyticsToken = process.env.ANALYTICS_TOKEN;

const eventTypes = [
  'Workshop/Start',
  'Workshop/View',
  'Workshop/Finish',
  'Session/Orphaned',
];

Sentry.AWSLambda.init({
  dsn: process.env.SENTRY_DSN_ANALYTICS,
  environment: config.context,
  tracesSampleRate: 0.1,
});

exports.handler = Sentry.AWSLambda.wrapHandler(async (event) => {
  if (event.httpMethod !== 'POST') {
    console.error('Not a POST');
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'POST ONLY' }),
    };
  }
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
  if (!event.body) {
    console.error('No Data');
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'No Data' }),
    };
  }
  const { body } = event;
  const jsonbody = JSON.parse(body);
  const workshopEvent = jsonbody.event;
  if (eventTypes.includes(workshopEvent.name)) {
    const time = new Date(workshopEvent.timestamp);
    const eventProperties = {
      'workshop event type': workshopEvent.name,
      'workshop name': workshopEvent.workshop,
    };
    if (workshopEvent.data.step) {
      const completion =
        (workshopEvent.data.step / workshopEvent.data.total) * 100;
      eventProperties['percentage complete'] = completion.toFixed(0);
    }
    amplitudeClient.logEvent({
      time: time.getTime(),
      event_type: 'workshop event',
      user_id: workshopEvent.user,
      event_properties: eventProperties,
    });

    // Send any events that are currently queued for sending.
    // Will automatically happen on the next event loop.
    await amplitudeClient.flush();
    return {
      statusCode: 200,
      body: JSON.stringify({ event: 'received' }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ event: 'discarded' }),
  };
});
