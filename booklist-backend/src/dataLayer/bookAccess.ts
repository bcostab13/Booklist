import { DocumentClient } from "aws-sdk/clients/dynamodb"
import * as AWS from "aws-sdk";
const AWSXRay = require('aws-xray-sdk')
import { BookItem } from "../models/BookItem";
//import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const XAWS = AWSXRay.captureAWS(AWS)

export class BookAccess {
    constructor (
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly booksTable = process.env.BOOKS_TABLE ) {
    }

    async getAllTodos(userId: string): Promise<BookItem[]> {
        console.log('Getting all books')

        const result = await this.docClient
        .query({
            TableName: this.booksTable,
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

    async createBook(book: BookItem): Promise<BookItem> {
        console.log('Creating book')

        await this.docClient.put({
            TableName: this.booksTable,
            Item: book
        }).promise()

        return book
    }
}