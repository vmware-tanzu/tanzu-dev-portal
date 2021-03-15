const { AuthorizationCode } = require("simple-oauth2");
const querystring = require("querystring");

const config = require("./config");

const base =
  config.context === "production" || config.context === "deploy-preview"
    ? "https://auth.esp.vmware.com/api/auth/v1"
    : "https://auth.esp-staging.vmware-aws.com/api/auth/v1";

function makeAuth(clientId, orgId) {
  if (!clientId) {
    throw new Error("Missing client ID");
  }

  // See: https://github.com/lelylan/simple-oauth2/blob/master/API.md#options
  const config = {
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

  return new AuthorizationCode(config);
}

function getDiscoveryUrl(params) {
  return `${base}/authorize?${querystring.stringify(params)}`;
}

function getClientId() {
  return config.context === "production" || config.context === "deploy-preview"
    ? process.env.PROD_CLIENT_ID
    : process.env.DEV_CLIENT_ID;
}

function getSiteURL() {
  return config.context != "production"
    ? config.deployPrimeURL
    : "https://tanzu.vmware.com";
}

function getRedirectURI(){
  return config.context == "production"
    ? "https://tanzu.vmware.com/developer/auth-callback"
    : `${config.deployPrimeURL}/.netlify/functions/auth-callback`;
}

module.exports = {
  makeAuth: makeAuth,
  getDiscoveryUrl: getDiscoveryUrl,
  getClientId: getClientId,
  getSiteURL: getSiteURL,
  getRedirectURI: getRedirectURI
};
