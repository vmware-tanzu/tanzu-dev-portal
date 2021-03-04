const cookie = require("cookie");
const { getDiscoveryUrl, getClientId } = require("./util/auth");
const base64 = require("./util/base64");

exports.handler = async (event, context) => {
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
    domain: process.env.DEPLOY_PRIME_URL.replace("https://", ""),
    maxAge: 600,
  });
  // redirect the user to the CSP discovery endpoint for authentication
  const params = {
    response_type: "code",
    client_id: getClientId(),
    redirect_uri: `${process.env.DEPLOY_PRIME_URL}/.netlify/functions/auth-callback`,
    state: base64.urlEncode(`csrf=${csrf}&path=${path}&referer=${event.headers.referer}`),
  };
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
