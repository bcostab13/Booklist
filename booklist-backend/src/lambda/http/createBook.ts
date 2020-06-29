import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateBookRequest } from '../../requests/CreateBookRequest'
import { createBook } from '../../businessLogic/books'
//import { getUserId } from '../lambda/utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newBook: CreateBookRequest = JSON.parse(event.body)
  //const userId = getUserId(event)
  const userId = "abc123"
  const item = await createBook(newBook, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}