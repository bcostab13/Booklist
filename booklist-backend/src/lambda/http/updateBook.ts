import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateBookRequest } from '../../requests/UpdateBookRequest'
import { updateBook } from '../../businessLogic/books'
//import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId
  const updatedBook: UpdateBookRequest = JSON.parse(event.body)
  //const userId = getUserId(event)
  const userId = "abc123"

  await updateBook(userId, bookId, updatedBook)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'  
    },
    body: null
  }
}
