import { DocumentClient } from "aws-sdk/clients/dynamodb"
import * as AWS from "aws-sdk";
const AWSXRay = require('aws-xray-sdk')
import { BookItem } from "../models/BookItem";
import { UpdateBookRequest } from "../requests/UpdateBookRequest";

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

    async deleteBook(bookId: string, userId: string): Promise<string> {
        console.log('Deleting book')

        await this.docClient.delete({
            TableName: this.booksTable,
            Key: {
                "userId": userId,
                "bookId": bookId
            }
        }).promise()

        return bookId
    }

    async updateBook(userId:string, bookId:string, updatedBook: UpdateBookRequest) {
        console.log('Updating book')
        const timestamp = new Date().toISOString()

        if(!updatedBook.dueDate) {
            updatedBook.dueDate = timestamp
        }

        const result = await this.docClient.update({
            TableName:this.booksTable,
            Key:{
                "userId": userId,
                "bookId": bookId
            },
            UpdateExpression: "set #st = :st, dueDate=:dd",
            ExpressionAttributeValues:{
                ":st":updatedBook.status,
                ":dd":updatedBook.dueDate
            },
            ExpressionAttributeNames:{
                "#st": "status"
            },
            ReturnValues:"UPDATED_NEW"
        }).promise()

        const items = result.$response.data
        return items as BookItem[]        
    }
}