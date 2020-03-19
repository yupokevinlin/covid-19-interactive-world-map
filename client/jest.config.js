module.exports = {
  roots: ["<rootDir>/src"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleFileExtensions: ["tsx", "ts", "jsx", "js", "json", "node"],
  snapshotSerializers: ["enzyme-to-json/serializer"]
};