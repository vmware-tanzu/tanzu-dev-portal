const cookie = require('cookie');
const Sentry = require('@sentry/serverless');
const { getDiscoveryUrl, getSiteURL, getRedirectURI, getRandomToken } = require('./util/auth');
const base64 = require('./util/base64');
// eslint-disable-next-line import/extensions,import/no-unresolved
const config = require('./util/config');

Sentry.AWSLambda.init({
    dsn: process.env.SENTRY_DSN_AUTH_START,
    environment: config.context,
    tracesSampleRate: 1.0,
});

exports.handler = Sentry.AWSLambda.wrapHandler(async (event) => {
    const path = event.path === './netlify/functions/auth-start' ? 'developer' : event.path;
    // random string stored in cookie that is verified in auth-callback
    const cookieKey = 'content-lib-csrf';
    const cookieVal = getRandomToken();
    const cookieParams = {
        secure: true,
        httpOnly: true,
        path: '/',
        maxAge: 600,
    };
    if (config.context === 'production' || config.context === 'deploy-preview') {
        cookieParams.domain = getSiteURL().replace('https://', '');
    }

    // redirects the user to the ESP discovery endpoint for authentication
    const espParams = {
        response_type: 'code',
        client_id: process.env.ESP_CLIENT_ID,
        redirect_uri: getRedirectURI(),
        state: base64.urlEncode(`csrf=${cookieVal}&path=${path}&referer=${event.headers.referer}`),
    };

    return {
        statusCode: 302,
        headers: {
            Location: getDiscoveryUrl(espParams),
            'Cache-Control': 'no-cache',
            'Set-Cookie': cookie.serialize(cookieKey, cookieVal, cookieParams),
        },
        body: '',
    };
});
