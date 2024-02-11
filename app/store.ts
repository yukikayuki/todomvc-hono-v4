export type Todo = {
  id: string
  title: string
  completed: boolean
}

let store: Todo[] = []

export const getTodos = async (filter: string | undefined) => {
  if (filter === 'active') {
    return store.filter((t) => !t.completed)
  }

  if (filter === 'completed') {
    return store.filter((t) => t.completed)
  }

  return store
}

export const addTodo = async (title: string) => {
  const id = crypto.randomUUID()
  const newTodo: Todo = {
    id,
    title,
    completed: false,
  }

  store = [...store, newTodo]
}

export const editTodo = async (id: string, title: string, completed: boolean) => {
  store = store.map((t) => {
    if (t.id === id) {
      return {
        ...t,
        title,
        completed,
      }
    }

    return t
  })
}

export const deleteTodo = async (id: string) => {
  store = store.filter((t) => t.id !== id)
}
