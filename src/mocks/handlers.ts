import { rest } from 'msw';
import mockData from './mockData';


export const handlers = [
    rest.get('http://localhost:8080/api/book', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(mockData),
        )
    }),
    rest.delete(`http://localhost:8080/api/book/${mockData[0].id}`, (req, res, ctx) => {
        return res(
            ctx.status(200)
        )
    }),
    rest.post('http://localhost:8080/api/book', async (req, res, ctx) => {
        const newBook = await req.json();
        const newBookWithId = { id: 4, ...newBook };
        const bookExists = mockData.some(book => book.name === newBook.name);
        if (bookExists) {
            return res(
                ctx.status(400),
                ctx.json({ message: 'A book with this name already exists.' }),
            );
        } else {
            mockData.push(newBookWithId);
            return res(
                ctx.status(201),
                ctx.json(newBook),
            );
        }
    }),
    rest.put(`http://localhost:8080/api/book/:id`, async (req, res, ctx) => {
        const { id } = req.params;
        const updatedBook = await req.json();
        const updatedBookWithId = { id, ...updatedBook}
        const bookIndex = mockData.findIndex(book => book.id === Number(id));
        if (bookIndex !== -1) {
            mockData[bookIndex] = updatedBookWithId;
            return res(
                ctx.status(200),
                ctx.json(updatedBook),
            );
        } else {
            return res(
                ctx.status(404),
                ctx.json({ message: 'Book not found' }),
            );
        }
    }),

];