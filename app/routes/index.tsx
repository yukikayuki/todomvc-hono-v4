import { createRoute } from 'honox/factory'
import { getTodos, Todo } from '../store'
import Main from '../islands/todo/main'

export default createRoute(async (c) => {
  const filter = c.req.query('filter')

  const todos = await getTodos(filter)

  return c.render(<App todos={todos} filter={filter} />, { title: 'Todos' })
})

const App = async ({ todos, filter }: { todos: Todo[]; filter: string | undefined }) => {
  return (
    <div class={'todoapp'}>
      <Header />
      <Main todos={todos} />
      <Footer filter={filter} />
    </div>
  )
}

const Header = () => {
  return (
    <header class={'header'}>
      <h1>todos</h1>
      <form class={'input-container'} method={'post'} action={'/todos'}>
        <input name={'new-todo'} class={'new-todo'} type={'text'} autofocus placeholder={'What needs to be done?'} />
      </form>
    </header>
  )
}

const Footer = ({ filter }: { filter: string | undefined }) => {
  return (
    <footer class={'footer'}>
      <ul class={'filters'}>
        <li>
          <a class={filter == null ? 'selected' : ''} href={'/'}>
            All
          </a>
        </li>
        <li>
          <a class={filter === 'active' ? 'selected' : ''} href={'/?filter=active'}>
            Active
          </a>
        </li>
        <li>
          <a class={filter === 'completed' ? 'selected' : ''} href={'/?filter=completed'}>
            Completed
          </a>
        </li>
      </ul>
    </footer>
  )
}
