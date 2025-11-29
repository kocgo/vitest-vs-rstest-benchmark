import React from 'react';
import '@testing-library/jest-dom';

// Rstest uses React's classic runtime by default, so make React available globally for JSX transforms.
(globalThis as typeof globalThis & { React: typeof React }).React = React;
