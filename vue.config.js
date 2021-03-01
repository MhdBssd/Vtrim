module.exports = {
  configureWebpack: {
    optimization: {
      minimize: true,
    },
    devtool: false,
    externals: ['vue', 'core-js'],
  },
  css: {
    extract: false,
  },
};
