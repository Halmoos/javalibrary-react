import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BooksTable from '../BooksTable';

it('renders table with 1 row', () => {
  render(<BooksTable />);
  const tableRowElements = screen.getAllByTestId("tableRow");
  expect(tableRowElements.length).toBe(1);
});

it('opens create modal when create button clicked', async () => {
    render(<BooksTable />);
    const createButton = screen.getByText("Create a book");
    console.log(createButton);
    fireEvent.click(createButton);
    expect(await screen.findByRole("button", { name: /Cancel/i})).toBeInTheDocument();
});