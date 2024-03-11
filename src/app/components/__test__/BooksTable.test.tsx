import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BooksTable from '../BooksTable';
import mockData from '../../../mocks/mockData';
import { ToastContainer } from 'react-toastify';

it('renders table with 1 row for each book', async () => {
  render(<BooksTable />);
  await waitFor(() => {
    const tableRowElements = screen.getAllByTestId("tableRow");
    expect(tableRowElements.length).toBe(mockData.length + 1);
  });
  const tableRowElements = screen.getAllByTestId("tableRow");
  expect(tableRowElements.length).not.toBe(1);
});

it('opens create modal when create button clicked', async () => {
  const { unmount } = render(<BooksTable />);
  const createButton = await screen.findByText("Create a book");
  fireEvent.click(createButton);
  expect(await screen.findByRole("button", { name: "Create" })).toBeInTheDocument();
  unmount(); // Unmount to avoid wrap in act() warning
});

it('opens delete modal when delete button clicked', async () => {
  const { unmount } = render(<BooksTable />);
  const deleteButton = await screen.findByTestId(`delete-button-${mockData[0].id}`);
  fireEvent.click(deleteButton);
  expect(await screen.findByText("Caution!")).toBeInTheDocument();
  unmount();
});

it('opens edit modal when edit button clicked with book data', async () => {
  const { unmount } = render(<BooksTable />);
  const editButton = await screen.findByTestId(`edit-button-${mockData[0].id}`);
  fireEvent.click(editButton);
  const inputs = await screen.findAllByTestId("input");
  const firstInput = await screen.findByPlaceholderText("Book Name");
  expect(firstInput).toHaveValue(mockData[0].name);
  expect(inputs.length).toBe(4);
  unmount();
});

it('deletes the book when the relative delete button is clicked', async () => {
  render(<BooksTable />);
  render(<ToastContainer />);
  const deleteButton = await screen.findByTestId(`delete-button-${mockData[0].id}`);
  fireEvent.click(deleteButton);
  const deleteButtons = await screen.findAllByText("Delete");
  const innerDeleteButton = deleteButtons[deleteButtons.length - 1];
  fireEvent.click(innerDeleteButton);
  await waitFor(() => {
    const tableRowElements = screen.getAllByTestId("tableRow");
    expect(tableRowElements.length).toBe(mockData.length);
  });
  const toast = screen.getByText("Book deleted successfully!");
  expect(toast).toBeInTheDocument();
});

it('opens the create book modal with empty inputs', async () => {
  const { unmount } = render(<BooksTable />);
  const createButton = await screen.findByText("Create a book");
  fireEvent.click(createButton);
  const nameInput = await screen.findByPlaceholderText("Book Name");
  const authorInput = await screen.findByPlaceholderText("Author");
  const dateInput = await screen.findByPlaceholderText("Select Date...");
  const genreInput = await screen.findByPlaceholderText("Genre");
  expect(nameInput).toHaveValue("");
  expect(authorInput).toHaveValue("");
  expect(dateInput).toHaveValue("");
  expect(genreInput).toHaveValue("");
  unmount();
});

it('creates a new book when the form is submitted', async () => {
  // To do: fix warnings
  const { unmount } = render(<BooksTable />);
  const createButton = await screen.findByText("Create a book");
  fireEvent.click(createButton);
  const nameInput = await screen.findByPlaceholderText("Book Name");
  const authorInput = await screen.findByPlaceholderText("Author");
  const dateInput = await screen.findByPlaceholderText("Select Date...");
  const genreInput = await screen.findByPlaceholderText("Genre");
  fireEvent.change(nameInput, { target: { value: 'New Book' } });
  fireEvent.change(authorInput, { target: { value: 'New Author' } });
  fireEvent.change(dateInput, { target: { value: '12-12-2024' } });
  fireEvent.change(genreInput, { target: { value: 'New Genre' } });
  const submitButton = await screen.findByText("Create");
  fireEvent.click(submitButton);
  await waitFor(() => {
     const tableRowElements = screen.getAllByTestId("tableRow");
     expect(tableRowElements.length).toBe(mockData.length + 1);
  });
  unmount();
 });

it('edits current bookwhen the form is submitted', async () => {
  const { unmount } = render(<BooksTable />);
  const editButton = await screen.findByTestId(`edit-button-${mockData[0].id}`);
  fireEvent.click(editButton);
  const nameInput = await screen.findByPlaceholderText("Book Name");
  const authorInput = await screen.findByPlaceholderText("Author");
  const dateInput = await screen.findByPlaceholderText("Select Date...");
  const genreInput = await screen.findByPlaceholderText("Genre");
  fireEvent.change(nameInput, { target: { value: 'Edited Book' } });
  fireEvent.change(authorInput, { target: { value: 'Edited Author' } });
  fireEvent.change(dateInput, { target: { value: '12-12-2024' } });
  fireEvent.change(genreInput, { target: { value: 'Edited Genre' } });
  const submitButton = await screen.findByTestId("createOrEditButton");
  fireEvent.click(submitButton);
  await waitFor(() => {
    const bookName = screen.getByTestId(`book-name-${mockData[0].id}`);
    expect(bookName.textContent).toBe("Edited Book");
  })
  await waitFor(() => {
    const bookName = screen.getByTestId(`book-author-${mockData[0].id}`);
    expect(bookName.textContent).toBe("Edited Author");
  })
  await waitFor(() => {
    const bookName = screen.getByTestId(`book-publishDate-${mockData[0].id}`);
    expect(bookName.textContent).toBe("2024-12-12");
  })
  await waitFor(() => {
    const bookName = screen.getByTestId(`book-genre-${mockData[0].id}`);
    expect(bookName.textContent).toBe("Edited Genre");
  })
  unmount();
});