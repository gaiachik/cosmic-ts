module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)(test).(ts|tsx|js)?(x)'],
  testPathIgnorePatterns: ['<rootDir>/build', '<rootDir>/node_modules/'],
};
