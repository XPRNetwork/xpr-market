module.exports = {
  images: {
    domains: [
      'cloudflare-ipfs.com',
      'gateway.pinata.cloud',
      'ipfs.io',
      'bloks.io',
    ],
  },
  target: 'serverless',
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack', 'url-loader'],
    });

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
};
