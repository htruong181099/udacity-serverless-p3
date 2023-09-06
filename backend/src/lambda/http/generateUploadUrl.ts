import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import {
  generateSignedUrl,
  uploadAttachmentUrl
} from '../../businessLogic/todos'
import { getUserId } from '../utils'
import * as uuid from 'uuid'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const attachmentId = uuid.v4()

    const url = await generateSignedUrl(attachmentId)
    await uploadAttachmentUrl(userId, todoId, attachmentId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        url
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
