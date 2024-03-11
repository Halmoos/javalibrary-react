import React, { useEffect, useState } from "react";
import { Book } from "../models/book";
import axios from "axios";
import {
    Container, TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    Table,
    Button,
} from "semantic-ui-react";
import DeleteModal from "./DeleteModal";
import CreateEditModal from "./CreateEditModal";
import { format } from "date-fns";

export default function BooksTable() {

    const [books, setBooks] = useState<Book[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [createEditModalOpen, setCreateEditModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book>();

    const handleOpenModal = (modalName: string,book?: Book) => {
        setSelectedBook(book);
        switch (modalName) {
            case "delete":
                setDeleteModalOpen(true);
                break;
            case "createEdit":
                setCreateEditModalOpen(true);
                break;
        }
 
    }

    const handleCloseModal = () => {
        setDeleteModalOpen(false);
        setCreateEditModalOpen(false);
    };

    const updateStateOnCreateOrEdit = (book: Book) => {
        const bookExists = books.some(x => x.id === book.id);
        setBooks(prevBooks => {
            if (bookExists) {
              return prevBooks.map(x => x.id === book.id ? book : x);
            } else {
              return [...prevBooks, book];
            }
         })
    }

    const updateStateOnDeletion = (id: string) => {
        setBooks(books.filter(x => x.id !== id))
    }

    useEffect(() => {
        axios.get<Book[]>('http://localhost:8080/api/book')
            .then(response => {
                setBooks(response.data)
            })
    }, []);
    return (
        <Container style={{ marginTop: '7em' }}>
            <div style={{display: "flex", justifyContent: "right"}}>
                <Button positive content="Create a book" onClick={() => handleOpenModal("createEdit")} />
            </div>
            <Table celled>
                <TableHeader>
                    <TableRow data-testid="tableRow">
                        <TableHeaderCell>Book Name</TableHeaderCell>
                        <TableHeaderCell>Author</TableHeaderCell>
                        <TableHeaderCell>Publish Date</TableHeaderCell>
                        <TableHeaderCell>Genre</TableHeaderCell>
                        <TableHeaderCell>Edit/Delete</TableHeaderCell>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {books.map(book => (
                        <TableRow data-testid="tableRow" key={book.id}>
                            <TableCell>{book.name}</TableCell>
                            <TableCell>{book.author}</TableCell>
                            <TableCell>{book.publishDate ? format(book.publishDate, 'yyyy-MM-dd') : ''}</TableCell>
                            <TableCell>{book.genre}</TableCell>
                            <TableCell>
                                <Button primary content="Edit" data-testid={`edit-button-${book.id}`} onClick={() => handleOpenModal("createEdit", book)} />
                                <Button negative content="Delete" data-testid={`delete-button-${book.id}`} onClick={() => handleOpenModal("delete", book)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <DeleteModal open={deleteModalOpen} close={handleCloseModal} book={selectedBook!} updateStateOnDeletion={updateStateOnDeletion} />
            <CreateEditModal open={createEditModalOpen} close={handleCloseModal} book={selectedBook} updateStateOnCreateOrEdit={updateStateOnCreateOrEdit} />
        </Container>
    )
}