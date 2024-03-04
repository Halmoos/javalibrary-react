import React, { useEffect, useState } from "react";
import { Button, Form, FormInput, Label, Modal, ModalActions, ModalContent, ModalHeader } from "semantic-ui-react";
import { Book } from "../models/book";
import ReactDatePicker from "react-datepicker";
import { toast } from "react-toastify";
import axios from "axios";

interface Props {
    open: boolean,
    close: any,
    book?: Book,
    updateStateOnCreateOrEdit: (book: Book) => void
}

export default function CreateEditModal({ open, close, book, updateStateOnCreateOrEdit }: Props) {

    const initialState: Book = book ? {
        id: book.id,
        name: book.name,
        author: book.author,
        publishDate: book.publishDate,
        genre: book.genre
    } : {
        id: "",
        name: "",
        author: "",
        publishDate: null,
        genre: ""
    };

    const [formState, setFormState] = useState<Book>(initialState);
    const { name, author, publishDate, genre } = formState || { id: '', name: '', author: '', publishDate: new Date(), genre: '' };

    useEffect(() => {
        if (book) {
            setFormState({
                id: book.id,
                name: book.name,
                author: book.author,
                publishDate: book.publishDate,
                genre: book.genre
            });
        } else {
            setFormState({
                id: "",
                name: "",
                author: "",
                publishDate: null,
                genre: ""
            });
        }
    }, [book, open]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState(prevState => ({
            ...(prevState || { id: '', name: '', author: '', publishDate: new Date(), genre: '' }),
            [name]: value
        }));
    };

    const handleDateChange = (date: Date) => {
        setFormState(prevState => ({
            ...(prevState || { id: '', name: '', author: '', publishDate: new Date(), genre: '' }),
            publishDate: date
        }));
    }

    const validateForm = () => {
        let isValid = true;

        if (!formState.name.trim()) {
            toast.error('Name is required')
            isValid = false
        }
        if (!formState.author.trim()) {
            toast.error('Author is required')
            isValid = false
        }
        if (!formState.publishDate) {
            toast.error('Publish Date is required')
            isValid = false
        }
        if (!formState.genre.trim()) {
            toast.error('Genre is required')
            isValid = false
        }
        return isValid
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            const { id, ...bodyData } = formState
            let bookFromResponse: Book = {
                id: "",
                name: "",
                author: "",
                publishDate: null,
                genre: ""
            }
            if (formState?.id) {
                await axios.put(`http://localhost:8080/api/book/${formState.id}`, bodyData)
                toast.success("Book updated successfully")
            } else {
                await axios.post(`http://localhost:8080/api/book`, bodyData).then((response) => { bookFromResponse = response.data })
                toast.success("Book created successfully")
            }
            updateStateOnCreateOrEdit(bookFromResponse)
            close()
        }
        catch (error: any) {
            toast.error("Problem creating or editing book")
        }

    }

    return (
        <Modal
            open={open}
            onClose={close}
        >
            <ModalHeader>{book ? "Edit content" : "Create a book"}</ModalHeader>
            <ModalContent>
                <Form onSubmit={handleSubmit}>
                    <FormInput required label="Book Name" placeholder="Book Name" name="name" value={name} onChange={handleInputChange} />
                    <FormInput required label="Author" placeholder="Author" name="author" value={author} onChange={handleInputChange} />
                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "1em" }}>
                        <Label content="Publish Date" />
                        <ReactDatePicker placeholderText="Select Date..." selected={publishDate} onChange={(date: Date) => handleDateChange(date)} />
                    </div>
                    <FormInput required label="Genre" placeholder="Genre" name="genre" value={genre} onChange={handleInputChange} />
                </Form>
            </ModalContent>

            <ModalActions>
                <Button content="Cancel" onClick={close} />
                <Button positive content={book ? "Edit" : "Create"} key={'done'} onClick={handleSubmit} />
            </ModalActions>
        </Modal>
    )
}