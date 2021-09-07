const cookie = require('cookie');
const Sentry = require('@sentry/serverless');
const jwt = require('jsonwebtoken');

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
    dsn: process.env.SENTRY_DSN_AUTH_START,
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
    const cookieParams = {
        secure: true,
        httpOnly: true,
        path: '/',
        maxAge: 600,
    };
    // don't add the domain parameter for localhost dev, only add if there's a url
    if (config.context === "production" || config.context === "deploy-preview")
        cookieParams.domain = getSiteURL().replace('https://', '');
    const c = cookie.serialize('content-lib-csrf', csrf, cookieParams);

    // Set a JWT token
    // const jwtData = {
    //     exp: Date.now() * 1000  - 86400,
    //     iat: Date.now() * 1000,
    // };
    // const netlifyJwt = jwt.sign(jwtData, process.env.JWT_SIGNING_SECRET, {
    //     algorithm: 'HS256',
    // });
    // const jwtCookieParams = {
    //     secure: true,
    //     httpOnly: false,
    //     path: '/',
    //     maxAge: 600,
    // }
    // if (config.context === "production" || config.context === "deploy-preview") {
    //     jwtCookieParams.domain = getSiteURL().replace('https://', '');
    // }
    // const jwtCookie = cookie.serialize("nf_jwt", netlifyJwt, jwtCookieParams);


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
            'Set-Cookie': c
        },
        body: '',
    };
});
