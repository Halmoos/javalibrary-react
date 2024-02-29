import React, { useEffect, useState } from "react";
import { Button, Form, FormInput, Label, Modal, ModalActions, ModalContent, ModalHeader } from "semantic-ui-react";
import { Book } from "../models/book";
import ReactDatePicker from "react-datepicker";

interface Props {
    open: boolean,
    close: any,
    book?: Book
}

export default function CreateEditModal({open, close, book} : Props) {

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

    const [formState, setFormState] = useState<Book | undefined>(initialState);
    const {name, author, publishDate, genre} = formState || {id: '', name: '', author: '', publishDate: new Date(), genre: ''};

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

    const handleSubmit = () => {
        console.log("From values" ,formState)
    }

    return (
        <Modal
            open={open}
            onClose={close}
        >
            <ModalHeader>{book ? "Edit content" : "Create a book"}</ModalHeader>
            <ModalContent>
                <Form onSubmit={handleSubmit}>
                    <FormInput label="Book Name" placeholder="Book Name" name="name" value={name} onChange={handleInputChange} />
                    <FormInput label="Author" placeholder="Author" name="author" value={author} onChange={handleInputChange} />
                    <div style={{display: "flex", flexDirection: "column", marginBottom: "1em"}}>
                        <Label content="Publish Date" />    
                        <ReactDatePicker placeholderText="Select Date..." selected={publishDate} onChange={(date: Date) => handleDateChange(date)}/>
                    </div>
                    <FormInput label="Genre" placeholder="Genre" name="genre" value={genre} onChange={handleInputChange} />
                </Form>
            </ModalContent>

            <ModalActions>
                <Button content="Cancel" onClick={close} />
                <Button positive content={book ? "Edit" : "Create"} key={'done'} onClick={handleSubmit} />
            </ModalActions>
        </Modal>
    )
}