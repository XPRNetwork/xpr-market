// eslint-disable-next-line
 const withTM = require('next-transpile-modules')(['@proton/web-sdk']);

module.exports = withTM({
  images: {
    domains: [
      'cloudflare-ipfs.com',
      'gateway.pinata.cloud',
      'ipfs.io',
      'bloks.io',
    ],
  },
  target: 'serverless',
  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|ts)x?$/,
      use: ['@svgr/webpack', 'url-loader'],
    });

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^electron$/,
      })
    );

    return config;
  },
  publicRuntimeConfig: {
    firebase: {
      apiKey: 'AIzaSyDmqEpBSu_APMnGpLvG43nrbWHKFXgR7FE',
      authDomain: 'proton-market.firebaseapp.com',
      projectId: 'proton-market',
    },
    protonBackendServiceApi: process.env.BACKEND_ENDPOINT,
  },
});
