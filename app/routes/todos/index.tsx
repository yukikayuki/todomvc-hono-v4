import { createRoute } from 'honox/factory'
import { addTodo, deleteTodo, editTodo } from '../../store'

export const POST = createRoute(async (c) => {
  const formData = await c.req.formData()
  const newTodoTitle = (formData.get('new-todo') as string) ?? ''

  await addTodo(newTodoTitle)

  return c.redirect('/')
})

export const PUT = createRoute(async (c) => {
  const json = await c.req.json()
  await editTodo(json.id, json.title, json.completed)

  return c.json({ status: 'ok' })
})

export const DELETE = createRoute(async (c) => {
  const json = await c.req.json()
  await deleteTodo(json.id)

  return c.json({ status: 'ok' })
})
