import { createRoute } from 'honox/factory'
import { addTodo, deleteTodo, editTodo } from '../../store'

export const POST = createRoute(async (c) => {
  const formData = await c.req.formData()
  const newTodoTitle = (formData.get('new-todo') as string) ?? ''

  await addTodo(newTodoTitle)

  return c.redirect('/')
})
