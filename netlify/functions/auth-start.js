const cookie = require("cookie");
const { getDiscoveryUrl, getClientId, getSiteURL } = require("./util/auth");
const base64 = require("./util/base64");
const config = require("./util/config");

exports.handler = async (event, context) => {
  console.log(event)
  var path = "";
  if (event.path === "/.netlify/functions/auth-start") {
    path = "developer/";
  } else {
    path = event.path;
  }
  // store a random string in a cookie that we can verify in the callback
  const csrf = randomToken();
  const c = cookie.serialize("content-lib-csrf", csrf, {
    secure: true,
    httpOnly: true,
    path: "/",
    domain: "tanzu.vmware.com",
    maxAge: 600,
  });
  // redirect the user to the CSP discovery endpoint for authentication
  const redirectUri =
    config.context == "production"
      ? "https://tanzu.vmware.com/developer/auth-callback"
      : `${config.deployPrimeURL}/.netlify/functions/auth-callback`;
  
  const params = {
    response_type: "code",
    client_id: getClientId(),
    redirect_uri: redirectUri,
    state: base64.urlEncode(
      `csrf=${csrf}&path=${path}&referer=${event.headers.referer}`
    ),
  };
  console.log(c)
  return {
    statusCode: 302,
    headers: {
      Location: getDiscoveryUrl(params),
      "Cache-Control": "no-cache",
      "Set-Cookie": c,
    },
    body: "",
  };
};

function randomToken() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
