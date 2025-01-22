module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.(css|scss|sass|less)$': 'jest-transform-stub',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-stub',
  },
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.setup.js'],
};
