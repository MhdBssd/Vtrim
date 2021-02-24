module.exports = {
  configureWebpack: {
    optimization: {
      minimize: true,
    },
    externals: ['vue', 'core-js'],
  },
  css: {
    extract: false,
  },
};
