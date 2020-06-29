import * as uuid from 'uuid'

import { CreateBookRequest } from '../requests/CreateBookRequest'
import { BookItem } from '../models/BookItem'
import { BookAccess } from '../dataLayer/bookAccess'
//import { getUserId } from '../lambda/utils'
//import { APIGatewayProxyEvent } from 'aws-lambda'
import { UpdateBookRequest } from '../requests/UpdateBookRequest'
import { createLogger } from '../utils/logger'

const bookAccess = new BookAccess()
const logger = createLogger('book')

export async function getAllBooks(userId: string): Promise<BookItem[]> {
    logger.info('Get books from user :' + userId)
    return await bookAccess.getAllTodos(userId)
}

export async function createBook(
    createBookRequest: CreateBookRequest,
    userId: string
): Promise<BookItem> {

    logger.info('Prepare data to add book')
    const itemId = uuid.v4()
    const timestamp = new Date().toISOString();

    logger.info('Save new book')
    return await bookAccess.createBook({
        bookId: itemId,
        userId: userId,
        name: createBookRequest.name,
        createdAt: timestamp,
        dueDate: createBookRequest.dueDate,
        status: 'pending',
        author: createBookRequest.author,
        category: createBookRequest.category
    })
}

export async function deleteBook(bookId: string, userId: string): Promise<string> {
    logger.info('Delete book:' + bookId)
    return bookAccess.deleteBook(bookId, userId)
}

export async function updateBook(userId: string, bookId: string, updatedBook: UpdateBookRequest): Promise<BookItem[]> {
    logger.info('Update book:' + bookId)
    return bookAccess.updateBook(userId, bookId, updatedBook)
}
