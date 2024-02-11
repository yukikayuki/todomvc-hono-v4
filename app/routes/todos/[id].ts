import { createRoute } from 'honox/factory'
import { deleteTodo, editTodo } from '../../store'

export const PUT = createRoute(async (c) => {
  const { id } = c.req.param()
  const json = await c.req.json()
  await editTodo(id, json.title, json.completed)

  return c.json({ status: 'ok' })
})

export const DELETE = createRoute(async (c) => {
  const { id } = c.req.param()
  await deleteTodo(id)

  return c.json({ status: 'ok' })
})
