module.exports = {
  pages: {
    index: {
      entry: "src/main.ts",
      title: "简易工具",
    },
  },
  lintOnSave: true,
  devServer: {
    proxy: {
      "^/": {
        target: "http://localhost:7788",
        ws: true,
        changeOrigin: true, //是否跨域
      },
    },
  },
};