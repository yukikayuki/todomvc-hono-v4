import { Todo } from '../../store'
import { useEffect, useState } from 'hono/jsx'
import { buildUrl } from '../../utils/buildUrl'

export default function Item({ todo }: { todo: Todo }) {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null)
  const [isWritable, setIsWritable] = useState(false)
  const [todoTitle, setTodoTitle] = useState(todo.title)

  useEffect(() => {
    // ここはwindowの世界
    const params = new URLSearchParams(window.location.search)
    setSearchParams(params)
  }, [])

  const updateTodoTitle = async (ev: Event) => {
    ev.preventDefault()
    ev.stopPropagation()

    const formData = new FormData(ev.currentTarget as HTMLFormElement)
    const newTitle = formData.get('new-title') as string

    const res = await fetch(`/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'edit-title', newTitle }),
    })

    if (res.status === 200) {
      setTodoTitle(newTitle)
      setIsWritable(false)
    } else {
      alert(`ERROR: HTTP Status is ${res.status}`)
    }
  }

  const idForToggleForm = `form-toggle-${todo.id}`
  const idForNewTitleInput = `input-new-title-${todo.id}`

  return (
    <li class={todo.completed ? 'completed' : ''}>
      <div class={'view'}>
        {isWritable && (
          <form onSubmit={updateTodoTitle}>
            <input
              id={idForNewTitleInput}
              class={'new-todo'}
              type={'text'}
              name={'new-title'}
              value={todoTitle}
              autofocus
              onBlur={() => setIsWritable(false)}
            />
          </form>
        )}
        {!isWritable && (
          <>
            <form id={idForToggleForm} method={'post'} action={buildUrl(`/todos/${todo.id}`, searchParams)}>
              <input type={'hidden'} name={'_action'} value={'toggle-completed'} />
            </form>
            <input
              class={'toggle'}
              type={'checkbox'}
              form={idForToggleForm}
              name={'completed'}
              checked={todo.completed}
              onChange={(ev) => {
                ;(document.getElementById(idForToggleForm) as HTMLFormElement).submit()
              }}
            />
            <label
              onDoubleClick={() => {
                setIsWritable(true)
                setTimeout(() => {
                  // タイトル編集inputのフォーカス and キャレットを最後の文字の後ろにする
                  const el = document.getElementById(idForNewTitleInput) as HTMLInputElement | null
                  const value = el?.value ?? ''
                  el?.focus()
                  el?.setSelectionRange(value.length, value.length)
                }, 100)
              }}
            >
              {todoTitle}
            </label>
            <form method={'post'} action={buildUrl(`/todos/${todo.id}`, searchParams)}>
              <input type={'hidden'} name={'_action'} value={'delete-todo'} />
              <button class={'destroy'} type={'submit'} />
            </form>
          </>
        )}
      </div>
    </li>
  )
}