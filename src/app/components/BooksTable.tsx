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
                    <TableRow>
                        <TableHeaderCell>Book Name</TableHeaderCell>
                        <TableHeaderCell>Author</TableHeaderCell>
                        <TableHeaderCell>Publish Date</TableHeaderCell>
                        <TableHeaderCell>Genre</TableHeaderCell>
                        <TableHeaderCell>Edit/Delete</TableHeaderCell>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {books.map(book => (
                        <TableRow key={book.id}>
                            <TableCell>{book.name}</TableCell>
                            <TableCell>{book.author}</TableCell>
                            <TableCell>{book.publishDate?.toString()}</TableCell>
                            <TableCell>{book.genre}</TableCell>
                            <TableCell>
                                <Button primary content="Edit" onClick={() => handleOpenModal("createEdit", book)} />
                                <Button negative content="Delete" onClick={() => handleOpenModal("delete", book)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <DeleteModal open={deleteModalOpen} close={handleCloseModal} book={selectedBook!} updateStateOnDeletion={updateStateOnDeletion} />
            <CreateEditModal open={createEditModalOpen} close={handleCloseModal} book={selectedBook} />
        </Container>
    )
}