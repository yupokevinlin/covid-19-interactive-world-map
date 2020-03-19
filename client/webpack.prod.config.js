const merge = require("webpack-merge");

const baseConfig = require("./webpack.dev.config");

module.exports = merge.smart(baseConfig, {
  mode: "production"
});