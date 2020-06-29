//import * as uuid from 'uuid'

//import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { BookItem } from '../models/BookItem'
import { BookAccess } from '../dataLayer/bookAccess'
//import { getUserId } from '../lambda/utils'
//import { APIGatewayProxyEvent } from 'aws-lambda'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const bookAccess = new BookAccess()
const logger = createLogger('book')

export async function getAllBooks(userId: string): Promise<BookItem[]> {
    logger.info('Get books from user :' + userId)
    return await bookAccess.getAllTodos(userId)
}
