import { DocumentClient } from "aws-sdk/clients/dynamodb"
import * as AWS from "aws-sdk";
//import * as AWSXRay from "aws-xray-sdk";
import { BookItem } from "../models/BookItem";
//import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

//const XAWS = AWSXRay.captureAWS(AWS)

export class BookAccess {
    constructor (
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.BOOKS_TABLE ) {
    }

    async getAllTodos(userId: string): Promise<BookItem[]> {
        console.log('Getting all books')

        const result = await this.docClient
        .query({
            TableName: this.todosTable,
            IndexName: 'BookIdIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
            ':userId': userId
            }
        })
        .promise()

        const items = result.Items
        return items as BookItem[]
    }
}