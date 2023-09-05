import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate'

const logger = createLogger('Todos')
const todoAccess: TodosAccess = new TodosAccess()
const attachmentUtils: AttachmentUtils = new AttachmentUtils()

// TODO: Implement businessLogic
export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
  logger.info(`getTodosForUser - userId ${userId}`)
  return await todoAccess.getTodos(userId)
}

export const createTodo = async (
  userId: string,
  request: CreateTodoRequest
) => {
  logger.info(`createTodo`)

  const item: TodoItem = {
    todoId: uuid.v4(),
    userId,
    createdAt: new Date().toISOString(),
    attachmentUrl: null,
    done: false,
    ...request
  }

  await todoAccess.createTodo(item)
  return item
}

export const updateTodo = async (
  userId: string,
  todoId: string,
  request: UpdateTodoRequest
) => {
  logger.info(`updateTodo`)
  const item: TodoItem = await todoAccess.getTodo(todoId)
  if (!item) {
    logger.info(`updateTodo`)
    return new createError.NotFound()
  }
  if (userId != item.userId) {
    logger.info(`updateTodo - userId ${userId} - Forbidden`)
    return new createError.Forbidden()
  }
  await todoAccess.updateTodo(todoId, request as TodoUpdate)
  return item
}

export const deleteTodo = async (userId: string, todoId: string) => {
  logger.info(`deleteTodo - userId ${userId} - todoId ${todoId}`)
  const item: TodoItem = await todoAccess.getTodo(todoId)
  if (!item) {
    logger.info(`deleteTodo`)
    return new createError.NotFound()
  }
  if (userId != item.userId) {
    logger.info(`deleteTodo - userId ${userId} - Forbidden`)
    return new createError.Forbidden()
  }
  await todoAccess.deleteTodo(todoId)
}

export const uploadAttachmentUrl = async (
  userId: string,
  todoId: string,
  attachmentId: string
) => {
  logger.info(
    `createAttachmentPresignedUrl - userId ${userId} - todoId ${todoId}`
  )
  const item = await todoAccess.getTodo(todoId)
  if (!item) {
    logger.info(`createAttachmentPresignedUrl`)
    return new createError.NotFound()
  }
  if (userId != item.userId) {
    logger.info(
      `createAttachmentPresignedUrl - userId ${userId} - todoId ${todoId} - Forbidden`
    )
    return new createError.Forbidden()
  }

  const attachmentUrl = attachmentUtils.getAttachmentUrl(attachmentId)
  await todoAccess.updateAttachmentUrl(todoId, attachmentUrl)
}

export const generateSignedUrl = async (
  attachmentId: string
): Promise<string> => {
  const url = await attachmentUtils.getSignedUrl(attachmentId)
  return url
}
