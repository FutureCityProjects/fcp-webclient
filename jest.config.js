module.exports = {
  collectCoverageFrom: [
    "pages/**/*.{ts,tsx}",
    "src/**/*.{ts,tsx}",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "types\\.ts",
    "index\\.ts",
    ".+\\.d\\.ts"
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  },
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/tests/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/tests/__mocks__/fileMock.js"
  },
  preset: 'ts-jest',
  roots: [
    "<rootDir>/pages/",
    "<rootDir>/src/",
    "<rootDir>/tests/",
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  verbose: true,
}
