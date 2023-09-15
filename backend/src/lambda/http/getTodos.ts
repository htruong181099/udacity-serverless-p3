import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { httpErrorHandler, cors } from 'middy/middlewares'

import { getTodosByCategory, getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId: string = getUserId(event)

    if (event.queryStringParameters && event.queryStringParameters.category.length > 0) {
      const {category} = event.queryStringParameters
      const items = await getTodosByCategory(userId, category)
      return {
        statusCode: 200,
        body: JSON.stringify({
          items
        })
      }
    } 

    const items = await getTodosForUser(userId)
      return {
        statusCode: 200,
        body: JSON.stringify({
          items
        })
      }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
