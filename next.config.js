/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPlugins = require('next-compose-plugins');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require('next-transpile-modules')(['@jitsi/react-sdk']);
module.exports = withPlugins([withTM],{
  experimental: {
    forceSwcTransforms: true,
  },
    trailingSlash: false,
    exportPathMap: async function (
        defaultPathMap,
        { dev, dir, outDir, distDir, buildId }
      ) {
        return {
          '/': { page: '/' },
          '/meet': { page: '/meet' },
          '/create': { page: '/create' },
        }
      },
})