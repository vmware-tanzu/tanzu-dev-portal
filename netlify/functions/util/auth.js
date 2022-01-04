/* eslint-disable no-console */
/* eslint-disable no-bitwise */
const { AuthorizationCode } = require("simple-oauth2");
const got = require('got');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line import/no-unresolved
const config = require("./config");

const base =
  config.context === "production" || config.context === "deploy-preview"
      ? "https://auth.esp.vmware.com/api/auth/v1"
      : "https://auth.esp-staging.vmware-aws.com/api/auth/v1";

function makeAuth(clientId) {
    if (!clientId) {
        throw new Error("Missing client ID");
    }

    // See: https://github.com/lelylan/simple-oauth2/blob/master/API.md#options
    const authConfig = {
        client: {
            id: clientId,
        },
        auth: {
            tokenHost: `${base}`,
            tokenPath: `${base}/tokens`,
        },
        http: {
            json: true,
        },
        options: {
            authorizationMethod: "body",
            bodyFormat: "json",
        },
    };

    return new AuthorizationCode(authConfig);
}

function getDiscoveryUrl(params) {
    const qs = (new URLSearchParams(params)).toString();
    return `${base}/authorize?${qs}`;
}

function getClientId() {
    return config.context === "production" || config.context === "deploy-preview"
        ? process.env.PROD_CLIENT_ID
        : process.env.DEV_CLIENT_ID;
}

function getSiteURL() {
    return config.context !== "production"
        ? config.deployPrimeURL
        : "https://tanzu.vmware.com";
}

function getRedirectURI(){
    return config.context === "production"
        ? "https://tanzu.vmware.com/developer/auth-callback"
        : `${config.deployPrimeURL}/.netlify/functions/auth-callback`;
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
        const req = await got.get(
            base+'/tokens/public-key',
        );
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
    getClientId,
    getSiteURL,
    getRedirectURI,
    randomToken,
    tokenIsValid
};
