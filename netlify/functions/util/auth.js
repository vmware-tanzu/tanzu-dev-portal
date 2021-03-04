const { AuthorizationCode } = require('simple-oauth2')
const querystring = require('querystring')

const base =
process.env.CONTEXT != "production"
  ? "https://auth.esp-staging.vmware-aws.com/api/auth/v1"
  : "https://auth.esp.vmware.com/api/auth/v1";

function makeAuth(clientId, orgId) {
  if (!clientId) {
    throw new Error('Missing client ID')
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
      authorizationMethod: 'body',
      bodyFormat: 'json'
    }
  }

  return new AuthorizationCode(config)
}


function getDiscoveryUrl(params) {
  return `${base}/authorize?${querystring.stringify(
    params
  )}`
}


module.exports = {
  makeAuth: makeAuth,
  getDiscoveryUrl: getDiscoveryUrl,
}
