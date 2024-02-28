import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { Modal } from "semantic-ui-react";

interface Props {
    open: boolean,
    close: any,
    bookId: any,
    updateStateOnDeletion: (id: string) => void
}

const handleDeleteClick = async (bookId: string) => {
    try{
        await axios.delete(`http://localhost:8080/api/book/${bookId}`)
        toast.success("Book deleted successfully!")
    } catch (error: any) {
        toast.error("Problem deleting book")
    }
}

export default function DeleteModal({open, close, bookId, updateStateOnDeletion} : Props) {
    return (
        <Modal
            open={open}
            onClose={close}
            size="tiny"
            header='Caution!'
            content={`Are you sure you want to delete this book?`}
            actions={['Cancel', { key: 'done', content: 'Delete', negative: true, 
                        onClick: () => {handleDeleteClick(bookId);
                                        updateStateOnDeletion(bookId)} }]}
        />
    )
}