import React from 'react';
import '@testing-library/jest-dom';

// Rstest uses React's classic runtime by default, so make React available globally for JSX transforms.
(globalThis as typeof globalThis & { React: typeof React }).React = React;

// Enable React's automatic act() environment flag to reduce noisy warnings from async updates.
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
