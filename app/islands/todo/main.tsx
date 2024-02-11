import { Todo } from '../../store'
import { useState } from 'hono/jsx'

export default function Main({ todos: initialTodos }: { todos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos)

  const deleteTodo = async (id: string) => {
    const res = await fetch(`/todos/${id}`, { method: 'DELETE' })

    if (res.status === 200) {
      setTodos(todos.filter((t) => t.id !== id))
    } else {
      alert(`ERROR: HTTP Status is ${res.status}`)
    }
  }

  const putTodo = async (todo: Todo) => {
    const res = await fetch(`/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: todo.title, completed: todo.completed }),
    })

    if (res.status === 200) {
      const newTodos = todos.map((t) => {
        if (t.id === todo.id) {
          return {
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
          }
        }

        return t
      })
      setTodos(newTodos)
    } else {
      alert(`ERROR: HTTP Status is ${res.status}`)
    }
  }

  return (
    <main class={'main'}>
      <ul class={'todo-list'}>
        {todos.map((t) => {
          return <Item todo={t} putTodo={putTodo} deleteTodo={deleteTodo} />
        })}
      </ul>
    </main>
  )
}

const Item = ({
  todo,
  deleteTodo,
  putTodo,
}: {
  todo: Todo
  deleteTodo: (id: string) => void
  putTodo: (todo: Todo) => void
}) => {
  const [isWritable, setIsWritable] = useState(false)

  return (
    <li class={todo.completed ? 'completed' : ''}>
      <div class={'view'}>
        {isWritable && (
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              const form = new FormData(ev.currentTarget as HTMLFormElement)
              const newTitle = form.get('editing-title') as string

              await putTodo({ ...todo, title: newTitle })
              setIsWritable(false)
            }}
          >
            <input
              class={'new-todo'}
              type={'text'}
              name={'editing-title'}
              value={todo.title}
              autofocus
              onBlur={() => setIsWritable(false)}
            />
          </form>
        )}
        {!isWritable && (
          <>
            <input
              class={'toggle'}
              type={'checkbox'}
              checked={todo.completed}
              onChange={() => putTodo({ ...todo, completed: !todo.completed })}
            />
            <label onDoubleClick={() => setIsWritable(true)}>{todo.title}</label>
            <button class={'destroy'} type={'button'} onClick={() => deleteTodo(todo.id)} />
          </>
        )}
      </div>
    </li>
  )
}
