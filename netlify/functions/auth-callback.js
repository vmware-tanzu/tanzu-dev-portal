const cookie = require("cookie");

const jwt = require("jsonwebtoken");
const querystring = require("querystring");
const { makeAuth, getPublicKeyEndpoint } = require("./util/auth");
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
    const clientId =
    process.env.CONTEXT != "production"
      ? process.env.DEV_CLIENT_ID
      : process.env.PROD_CLIENT_ID;
  
    const oauth = makeAuth(clientId);
    const tokenResponse = await oauth.getToken({
      code: code,
      redirect_uri: `${process.env.URL}/.netlify/functions/auth-callback`,
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
        exp: decoded.payload.exp,
        iat: decoded.payload.iat,
        sub: decoded.payload.sub,
        iss: `${process.env.URL}`,
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
      domain: process.env.URL.replace("https://", ""),
      expires: new Date(decoded.payload.exp * 1000), // same expiration as CSP token
    });

    // redirect the user to where they were originally trying to get
    // with the cookie so that Netlify lets them in
    var redirect
    if (parsed.path.includes('get-workshop')){
      redirect = `${process.env.URL}/${parsed.path}?src=${parsed.referer}`;
    } else{
      redirect = `${process.env.URL}/${parsed.path || ""}`;
    }
    console.log(redirect)
    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "no-cache",
        "Set-Cookie": c,
      },
      body: `<html><head><title>Redirect</title><meta http-equiv="refresh" content="0;url=${redirect}" /></head><body></body></html>`,
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
