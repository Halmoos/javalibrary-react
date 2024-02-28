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

export default function BooksTable() {

    const [books, setBooks] = useState<Book[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);

    const handleOpenModal = (id: any) => {
        setSelectedBookId(id);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
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
                                <Button primary content="Edit" />
                                <Button negative content="Delete" onClick={() => handleOpenModal(book.id)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <DeleteModal open={modalOpen} close={handleCloseModal} bookId={selectedBookId} updateStateOnDeletion={updateStateOnDeletion} />
        </Container>
    )
}