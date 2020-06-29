import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getAllBooks } from '../../businessLogic/books'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
    const userId = getUserId(event)
    const books = await getAllBooks(userId)
    
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'  
        },
        body: JSON.stringify({
            items: books
        })
    }
}
