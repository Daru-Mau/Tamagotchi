// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  // Add additional file extensions
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    getSourceExts: () => [
      "jsx",
      "js",
      "ts",
      "tsx",
      "json",
      "svg",
      "png",
      "jpg",
      "jpeg",
    ],
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => !["svg"].includes(ext)),
    sourceExts: [
      ...resolver.sourceExts,
      "svg",
      "json",
      "js",
      "ts",
      "tsx",
      "cjs",
      "mjs",
    ],
  };

  return config;
})();
