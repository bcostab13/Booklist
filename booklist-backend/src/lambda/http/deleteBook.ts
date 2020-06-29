import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteBook } from '../../businessLogic/books'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const bookId = event.pathParameters.bookId
    const userId = getUserId(event)

    await deleteBook(bookId, userId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
      },
      body: null
    }
  }

