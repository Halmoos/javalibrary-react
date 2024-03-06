import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

it('renders app with title JavaLibrary', () => {
  render(<App />);
  expect(global.window.document.title).toBe("JavaLibrary");
});
