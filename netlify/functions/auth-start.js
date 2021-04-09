const cookie = require('cookie');
const Sentry = require('@sentry/serverless');

const {
    getDiscoveryUrl,
    getClientId,
    getSiteURL,
    getRedirectURI,
    randomToken,
} = require('./util/auth');
const base64 = require('./util/base64');
// eslint-disable-next-line import/no-unresolved
const config = require("./util/config");

Sentry.AWSLambda.init({
    dsn: config.sentry.authStartDsn,
    environment: config.context,
    tracesSampleRate: 1.0,
});

exports.handler = Sentry.AWSLambda.wrapHandler(async (event) => {
    let path = '';
    if (event.path === '/.netlify/functions/auth-start') {
        path = 'developer/';
    } else {
        path = event.path;
    }
    // store a random string in a cookie that we can verify in the callback
    const csrf = randomToken();
    const c = cookie.serialize('content-lib-csrf', csrf, {
        secure: true,
        httpOnly: true,
        path: '/',
        domain: getSiteURL().replace('https://', ''),
        maxAge: 600,
    });
    // redirect the user to the CSP discovery endpoint for authentication
    const params = {
        response_type: 'code',
        client_id: getClientId(),
        redirect_uri: getRedirectURI(),
        state: base64.urlEncode(
            `csrf=${csrf}&path=${path}&referer=${event.headers.referer}`,
        ),
    };
    return {
        statusCode: 302,
        headers: {
            Location: getDiscoveryUrl(params),
            'Cache-Control': 'no-cache',
            'Set-Cookie': c,
        },
        body: '',
    };
});
