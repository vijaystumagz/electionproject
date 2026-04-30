// src/setupTests.js
import '@testing-library/jest-dom';

// jsdom does not implement scrollTo — mock it globally
window.HTMLElement.prototype.scrollTo = () => {};
window.scrollTo = () => {};
