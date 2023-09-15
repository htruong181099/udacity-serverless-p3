import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly TODOS_TABLE = process.env.TODOS_TABLE,
    private readonly TODOS_USER_INDEX = process.env.TODOS_USER_INDEX
  ) {}

  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`getTodos - userId ${userId}`)

    const result = await this.docClient
      .query({
        TableName: this.TODOS_TABLE,
        IndexName: this.TODOS_USER_INDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items

    return items as TodoItem[]
  }

  async getTodo(todoId: string): Promise<TodoItem> {
    logger.info(`getTodo - todoId ${todoId}`)

    const result = await this.docClient
      .get({
        TableName: this.TODOS_TABLE,
        Key: { todoId }
      })
      .promise()

    const item = result.Item

    return item as TodoItem
  }

  async createTodo(item: TodoItem) {
    logger.info(`createTodo - userId ${item.userId}`)

    await this.docClient
      .put({
        TableName: this.TODOS_TABLE,
        Item: item
      })
      .promise()
  }

  async updateTodo(todoId: string, item: TodoUpdate) {
    logger.info(`updateTodo`)

    await this.docClient
      .update({
        TableName: this.TODOS_TABLE,
        Key: {
          todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ExpressionAttributeValues: {
          ':name': item.name,
          ':dueDate': item.dueDate,
          ':done': item.done
        }
      })
      .promise()
  }

  async deleteTodo(todoId: string) {
    logger.info(`deleteTodo`)

    await this.docClient
      .delete({
        TableName: this.TODOS_TABLE,
        Key: {
          todoId
        }
      })
      .promise()
  }

  async updateAttachmentUrl(todoId: string, attachmentUrl: string) {
    logger.info(`updateAttachmentUrl - todoId ${todoId}`)

    await this.docClient
      .update({
        TableName: this.TODOS_TABLE,
        Key: { todoId },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
  }

  async deleteAttachment(todoId: string) {
    logger.info(`deleteAttachment - todoId ${todoId}`)

    await this.docClient
      .update({
        TableName: this.TODOS_TABLE,
        Key: { todoId },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': null
        }
      })
      .promise()
  }

  async getTodosByCategory(userId: string, category: string): Promise<TodoItem[]> {
    logger.info(`getTodosByCategory - userId ${userId} - category ${category}`)

    const result = await this.docClient
      .query({
        TableName: this.TODOS_TABLE,
        IndexName: this.TODOS_USER_INDEX,
        KeyConditionExpression: 'userId = :userId',
        FilterExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':category': category,
        }
      })
      .promise()

    const items = result.Items

    return items as TodoItem[]
  }

  async setTodoCategory(todoId: string, category: string) {
    logger.info(`setTodoCategory - todoId ${todoId} - category ${category}`)

    await this.docClient
    .update({
      TableName: this.TODOS_TABLE,
      Key: {
        todoId
      },
      UpdateExpression: 'set #category = :category',
      ExpressionAttributeNames: {
        '#category': 'category'
      },
      ExpressionAttributeValues: {
        ':category': category
      }
    })
    .promise()
  }

  async deleteCategory(todoId: string) {
    logger.info(`deleteCategory - todoId ${todoId}`)

    await this.docClient
      .update({
        TableName: this.TODOS_TABLE,
        Key: { todoId },
        UpdateExpression: 'set category = :category',
        ExpressionAttributeValues: {
          ':category': null
        }
      })
      .promise()
  }
}
