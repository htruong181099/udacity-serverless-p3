import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodoCategory } from '../../businessLogic/todos'
import { UpdateCategoryRequest } from '../../requests/UpdateCategoryRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const request: UpdateCategoryRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const item = await updateTodoCategory(userId, todoId, request.category)

    return {
      statusCode: 200,
      body: JSON.stringify({
        item
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
