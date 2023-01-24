/* eslint-disable no-console */
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const Sentry = require('@sentry/serverless');
const {
    makeAuth,
    getSiteURL,
    getRedirectURI,
    getRandomToken,
    tokenIsValid
} = require('./util/auth');
const redirectTemplate = require('./util/redirectTemplate')
const base64 = require('./util/base64');
const { config } = require("./util/config");

const netlifyCookieName = 'nf_jwt';

Sentry.AWSLambda.init({
    dsn: process.env.SENTRY_DSN_AUTH_CALLBACK,
    environment: config.context,
    tracesSampleRate: 1.0,
});


exports.handler = Sentry.AWSLambda.wrapHandler(async (event) => {
    // we should only get here via a redirect from ESP, which would have
    // an authorization code in the querystring. if that's not present,
    // then someone didn't follow the correct flow - bail early
    if (!event.queryStringParameters) {
        console.error('Missing query params, unauthorized');
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Not authorized' }),
        };
    }

    try {
        const { code, state } = event.queryStringParameters;
        const urlSearchParams = new URLSearchParams(base64.urlDecode(state));
        const parsed = Object.fromEntries(urlSearchParams.entries());

        const cookies = cookie.parse(event.headers.cookie);
        if (!parsed.csrf || parsed.csrf !== cookies['content-lib-csrf']) {
            console.error(
                'State mismatch (potential CSRF), unauthorized',
                state,
                cookies['content-lib-csrf'],
            );
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Not authorized' }),
            };
        }

        const oauth = makeAuth();
        const tokenResponse = await oauth.getToken({
            code,
            redirect_uri: getRedirectURI(),
        });

        const { token } = tokenResponse;
        // eslint-disable-next-line camelcase
        const { access_token } = token;
        const decoded = jwt.decode(access_token, { complete: true });
        const valid = await tokenIsValid(access_token);
        if (!valid) {
            console.error('invalid token, access denied');
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'ESP access denied' }),
            };
        }
        const jwtToken = {
            exp: decoded.payload.iat + 86400,
            iat: decoded.payload.iat,
            context: decoded.payload.context,
            context_name: decoded.payload.context_name,
            app_metadata: {
                authorization: {
                    // this role maps to what we've set up in our Netlify _redirects file
                    // (for now, anyone who gets a token from ESP is considered a user)
                    roles: ['user'],
                },
            },
        };

        const cookieUrlSearchParams = new URLSearchParams(cookies.OptanonConsent);
        const oneTrustCookieParsed = Object.fromEntries(cookieUrlSearchParams.entries());
        if (oneTrustCookieParsed && oneTrustCookieParsed.groups){
            const groupposition = oneTrustCookieParsed.groups.search('C0002:') + 6;
            if (oneTrustCookieParsed.groups[groupposition] === '0') {
                jwtToken.id = getRandomToken();
            }else {
                jwtToken.name = decoded.payload.username;
                jwtToken.id = decoded.payload.username;
                jwtToken.acct = decoded.payload.acct;
                jwtToken.sub = decoded.payload.sub;
            }
        } else {
            jwtToken.name = decoded.payload.username;
            jwtToken.id = decoded.payload.username;
            jwtToken.acct = decoded.payload.acct;
            jwtToken.sub = decoded.payload.sub;
        }

        const netlifyJwt = jwt.sign(jwtToken, process.env.JWT_SECRET, {
            algorithm: 'HS256',
        });

        const cookieParams = {
            secure: true,
            httpOnly: false,
            path: '/',
            expires: new Date(decoded.payload.exp * 1000), // same expiration as ESP token
        }

        if (config.context === "production" || config.context === "deploy-preview") {
            cookieParams.domain = getSiteURL().replace('https://', '');
        }

        const c = cookie.serialize(netlifyCookieName, netlifyJwt, cookieParams);

        // redirect the user to where they were originally trying to get
        // with the cookie so that Netlify lets them in
        const redirect = parsed.path.includes('get-workshop')
            ? `${getSiteURL()}${parsed.path}?src=${parsed.referer}`
            : `${getSiteURL()}${parsed.path || ''}`;

        const redirectBody = redirectTemplate.replace("REDIRECT_URL", redirect)
        
        return {
            statusCode: 200,
            headers: {
                'Cache-Control': 'no-cache',
                'Set-Cookie': c,
            },
            body: redirectBody,
        };
    } catch (err) {
        Sentry.captureException(err);
        return {
            statusCode: err.statusCode || 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
});
