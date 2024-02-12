import { createRoute } from 'honox/factory'
import invariant from 'tiny-invariant'
import { addTodo, clearCompleted, deleteTodo, editTodo, getTodo, toggleAll } from '../../store'
import { buildUrl } from '../../utils/buildUrl'

export const POST = createRoute(async (c) => {
  const { id } = c.req.param()
  const searchParams = new URLSearchParams(new URL(c.req.url).search)
  const formData = await c.req.formData()
  const _action = formData.get('_action')
  invariant(_action)
  console.info({ _action })

  if (_action === 'new-todo') {
    const newTitle = formData.get('new-title')
    await addTodo(newTitle as string)
  }

  if (_action === 'toggle-all') {
    await toggleAll()
  }

  if (_action === 'toggle-completed') {
    const completed = formData.get('completed')

    const todo = await getTodo(id)
    invariant(todo)

    await editTodo(id!, todo.title, completed === 'on')
  }

  if (_action === 'edit-title') {
    const newTitle = formData.get('new-title')
    invariant(newTitle)

    const todo = await getTodo(id)
    invariant(todo)

    await editTodo(id!, newTitle as string, todo.completed)
  }

  if (_action === 'delete-todo') {
    await deleteTodo(id)
  }

  if (_action === 'clear-completed') {
    await clearCompleted()
  }

  return c.redirect(buildUrl('/', searchParams))
})
