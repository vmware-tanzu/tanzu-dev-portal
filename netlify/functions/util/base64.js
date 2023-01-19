/* eslint-disable new-cap */
/*
 * base64.js: An extremely simple implementation of base64 encoding / decoding using node.js Buffers
 *
 * (C) 2010, Nodejitsu Inc.
 * (C) 2011, Cull TV, Inc.
 *
 */

const base64 = exports;

base64.encode = (unencoded) => new Buffer.from(unencoded || '').toString('base64');

base64.decode = (encoded) => new Buffer.from(encoded || '', 'base64').toString('utf8');

base64.urlEncode = (unencoded) => {
    const encoded = base64.encode(unencoded);
    return encoded.replace('+', '-').replace('/', '_').replace(/=+$/, '');
};

base64.urlDecode = (encoded) => {
    let newencoded = encoded.replace('-', '+').replace('_', '/');
    while (newencoded.length % 4) newencoded += '=';
    return base64.decode(newencoded);
};
