// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

const originalError = console.error;

beforeAll(() => {    
    console.error = (...args: string[]) => {
        // Ignore not wrapped in act() warnings.  When testing components making async requests
        // awaiting the promise outside of act() will cause this warning.
        if (/Warning.*not wrapped in act/.test(args[0])) {
            return
        }

        // Ignore testID error messages.  This is used by react-testing/react library.
        if(/Warning.*not recognize the .* prop on DOM element/.test(args[0]) && args[1] === 'data-testId') {
            return
        }

        originalError.call(console, ...args)
    }

})

afterAll(() => {
    console.error = originalError
})