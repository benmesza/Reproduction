module.exports = {
    resolve: {
      fallback: {
        crypto: "./node_modules/crypto-browserify",
        stream: "./node_modules/stream-browserify"
      }
    }
};