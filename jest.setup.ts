import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.history
Object.defineProperty(window, 'history', {
    value: {
        replaceState: jest.fn()
    },
    writable: true
});

// Mock fetch
global.fetch = jest.fn();

// Mock html2canvas
jest.mock('html2canvas', () => jest.fn(() => Promise.resolve({
    toDataURL: () => 'data:image/png;base64,mock'
})));

// Reset mocks between tests
beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
});
