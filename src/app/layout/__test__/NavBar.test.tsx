import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from '../NavBar';

it('renders navbar text', () => {
  render(<NavBar />);
  const navbarTextElement = screen.getByText(/JavaLibrary/i);
  expect(navbarTextElement).toBeInTheDocument();
});
