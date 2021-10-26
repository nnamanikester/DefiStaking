module.exports = {
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".js", ".ts", ".tsx", ".json"],
        alias: {
          tests: ["./tests/"],
          "@": "./src",
        },
      },
    ],
  ],
};
