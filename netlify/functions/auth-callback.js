const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const querystring = require("querystring");
const { makeAuth, getClientId, getSiteURL} = require("./util/auth");
const base64 = require("./util/base64");
const { parse } = require("querystring");

const netlifyCookieName = "nf_jwt";

exports.handler = async (event, context) => {
  // we should only get here via a reidrect from CSP, which would have
  // an authorization code in the query string. if that's not present,
  // then someone didn't follow the correct flow - bail early
  if (!event.queryStringParameters) {
    console.error("Missing query params, unauthorized");
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Not authorized" }),
    };
  }

  try {
    const { code, state } = event.queryStringParameters;
    const parsed = querystring.parse(base64.urlDecode(state));
    const cookies = cookie.parse(event.headers.cookie);
    if (!parsed.csrf || parsed.csrf !== cookies["content-lib-csrf"]) {
      console.error(
        "State mismatch (potential CSRF), unauthorized",
        state,
        cookies["content-lib-csrf"]
      );
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Not authorized" }),
      };
    }

    const oauth = makeAuth(getClientId());
    const tokenResponse = await oauth.getToken({
      code: code,
      redirect_uri: `${getSiteURL()}/.netlify/functions/auth-callback`,
    });

    const { token } = tokenResponse;
    const { access_token } = token;
    const decoded = jwt.decode(access_token, { complete: true });
    const valid = await tokenIsValid(access_token);
    if (!valid) {
      console.error("invalid token, access denied");
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "CSP access denied" }),
      };
    }

    const netlifyJwt = jwt.sign(
      {
        name: decoded.payload.username,
        id: decoded.payload.username,
        acct: decoded.payload.acct,
        exp: decoded.payload.iat + 86400,
        iat: decoded.payload.iat,
        sub: decoded.payload.sub,
        context: decoded.payload.context,
        context_name: decoded.payload.context_name,
        app_metadata: {
          authorization: {
            // this role maps to what we've set up in our Netlify _redirects file
            // (for now, anyone who gets a token from CSP is considered a user)
            roles: ["user"],
          },
        },
      },
      process.env.JWT_SIGNING_SECRET,
      { algorithm: "HS256" }
    );

    const c = cookie.serialize(netlifyCookieName, netlifyJwt, {
      secure: true,
      httpOnly: false,
      path: "/",
      domain: getSiteURL().replace("https://", ""),
      expires: new Date(decoded.payload.exp * 1000), // same expiration as CSP token
    });

    // redirect the user to where they were originally trying to get
    // with the cookie so that Netlify lets them in
    var redirect
    if (parsed.path.includes('get-workshop')){
      redirect = `${getSiteURL()}/${parsed.path}?src=${parsed.referer}`;
    } else{
      redirect = `${getSiteURL()}/${parsed.path || ""}`;
    }
    console.log(redirect)
    const redirectBody = `<html><head><script>
    function getCookie(name) {
      var dc = document.cookie;
      var prefix = name + "=";
      var begin = dc.indexOf("; " + prefix);
      if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
      } else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
          end = dc.length;
        }
      }
    
      return decodeURI(dc.substring(begin + prefix.length, end));
    }
    
    function setGTM(w,d,s,l,i){ w[l]=w[l]||[]; w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'}); var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:''; j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); }
    if (document.cookie.indexOf('OptanonConsent') > -1 && document.cookie.indexOf('groups=') > -1) { setGTM(window,document,'script','dataLayer','GTM-TQ9H33K'); } else{ waitForOnetrustActiveGroups(); } var timer; function waitForOnetrustActiveGroups() { if (document.cookie.indexOf('OptanonConsent') > -1 && document.cookie.indexOf('groups=') > -1) { clearTimeout(timer); setGTM(window,document,'script','dataLayer','GTM-TQ9H33K'); } else{ timer=setTimeout(waitForOnetrustActiveGroups, 250); } }
    dataLayer.push({'event': 'setUserId', 'userId': JSON.parse(atob(getCookie("nf_jwt").split('.')[1])).id})</script><title>Redirect</title><meta http-equiv="refresh" content="0;url=${redirect}" /></head><body></body></html>`
    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "no-cache",
        "Set-Cookie": c,
      },
      body: redirectBody,
    };
  } catch (err) {
    console.error(err.message);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

async function tokenIsValid(tokenStr) {
  try {
    const publicKey =  "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiU0lm33VdB0vLrbSS3jIu4IyXyxqcbvH\niNexGuUA6Xgltp2YIaqU8MDyD+a2YGOlYBegeqb1Hm5G9xId3ewIG4+lM5TTq1PAHL1dnIDyOJb8\nBdhPCt6kYCvHcSVjFCVXb8jW+VDwHppxEVqQYWwc49qWi9ksoBiLn0zboogLrZ1+d89zFxEjuYsM\nunI/OBiAWcp2eEOVNbQeXcjolPcyYV3GR8+OCOQ0Rd02SesiPWxMF73fIdLTiVAqHZIc0KzBaiSB\n/LzB3nqDx2zHKMVmdoFkcAKX9bQBoovjd/WwbGfUXQ1Hciq5DK9Lg9d6fJSBwz129rUqfHWXTxXk\n7aM6hwIDAQAB\n-----END PUBLIC KEY-----"
    jwt.verify(tokenStr, publicKey, { algorithms: ["RS256"] });
    return true;
  } catch (err) {
    console.error("Error validating CSP token", err);
    return false;
  }
}
