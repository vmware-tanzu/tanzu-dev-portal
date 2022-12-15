/* eslint-disable no-console */
/* eslint-disable no-bitwise */
const { AuthorizationCode } = require("simple-oauth2");
const got = require('got');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/extensions,import/no-unresolved
const config = require("./config");

const authURL = process.env.ESP_AUTH_URL
const espClientId = process.env.ESP_CLIENT_ID

function makeAuth() {
    if (!espClientId) {
        throw new Error("Missing client ID");
    }
    // See: https://github.com/lelylan/simple-oauth2/blob/master/API.md#options
    const authConfig = {
        client: {
            id: espClientId,
        },
        auth: {
            tokenHost: `${authURL}`,
            tokenPath: `${authURL}/tokens`,
        },
        http: {
            json: true,
        },
        options: {
            authorizationMethod: 'body',
            bodyFormat: 'json',
        },
    };
    return new AuthorizationCode(authConfig);
}

function getDiscoveryUrl(params) {
    const qs = (new URLSearchParams(params)).toString();
    return `${authURL}/authorize?${qs}`;
}

function getSiteURL() {
    return config.context !== 'production' ? config.deployPrimeURL : 'https://tanzu.vmware.com';
}

function getRedirectURI() {
    return config.context !== 'production' ? `${config.deployPrimeURL}/.netlify/functions/auth-callback` : 'https://tanzu.vmware.com/developer/auth-callback';
}

function randomToken() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

async function tokenIsValid(tokenStr) {
    try {
        const req = await got.get(`${authURL}/tokens/public-key`);
        const key = JSON.parse(req.body);
        const convertKey = key.key.replace(/RSA /gi, '');
        jwt.verify(tokenStr, convertKey, { algorithms: [key.alg] });
        return true;
    } catch (err) {
        console.error('Error validating ESP token', err);
        return false;
    }
}
module.exports = {
    makeAuth,
    getDiscoveryUrl,
    espClientId,
    getSiteURL,
    getRedirectURI,
    randomToken,
    tokenIsValid
};
