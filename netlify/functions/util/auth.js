/* eslint-disable no-console */
/* eslint-disable no-bitwise */
const { AuthorizationCode } = require('simple-oauth2');
const got = require('got');
const jwt = require('jsonwebtoken');
const { config } = require('./config');

const authURL = process.env.ESP_AUTH_URL;
const prodURL = 'https://tanzu.vmware.com';

function makeAuth() {
    const clientID = process.env.ESP_CLIENT_ID;
    if (!clientID) {
        throw new Error('Missing client ID');
    }
    // See: https://github.com/lelylan/simple-oauth2/blob/master/API.md#options
    const authConfig = {
        client: { id: clientID },
        auth: {
            tokenHost: `${authURL}`,
            tokenPath: `${authURL}/tokens`,
        },
        http: { json: true },
        options: {
            authorizationMethod: 'body',
            bodyFormat: 'json',
        },
    };
    return new AuthorizationCode(authConfig);
}

function getDiscoveryUrl(params) {
    const queryStr = new URLSearchParams(params).toString();
    return `${authURL}/authorize?${queryStr}`;
}

function getSiteURL() {
    return config.context === 'production' ? prodURL : config.siteURL;
}

function getRedirectURI() {
    return config.context === 'production' ? `${prodURL}/developer/auth-callback` : `${config.siteURL}/.netlify/functions/auth-callback`;
}

function getRandomToken() {
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
    getSiteURL,
    getRedirectURI,
    getRandomToken,
    tokenIsValid,
};
