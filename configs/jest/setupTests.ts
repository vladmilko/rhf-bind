import '@testing-library/jest-dom';

/** Мок методов warn и error, для скрытия ворнингов реакта в тестах */
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
