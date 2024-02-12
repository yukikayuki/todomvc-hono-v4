import { createRoute } from 'honox/factory'
import { getTodos, Todo } from '../store'
import Item from '../islands/todo/item'

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
      <Footer todos={todos} filter={filter} />
    </div>
  )
}

const Header = () => {
  return (
    <header class={'header'}>
      <h1>todos</h1>
      <form class={'input-container'} method={'post'} action={'/todos/new'}>
        <input type={'hidden'} name={'_action'} value={'new-todo'} />
        <input name={'new-title'} class={'new-todo'} type={'text'} autofocus placeholder={'What needs to be done?'} />
      </form>
    </header>
  )
}

const Main = ({ todos }: { todos: Todo[] }) => {
  return (
    <main class={'main'}>
      <div class={'toggle-all-container'}>
        <form method={'post'} action={`/todos/all`}>
          <input type={'hidden'} name={'_action'} value={'toggle-all'} />
          <input id={'toggle-all'} class={'toggle-all'} type={'submit'} />
          <label class={'toggle-all-label'} for={'toggle-all'}>
            Toggle All Input
          </label>
        </form>
      </div>

      <ul class={'todo-list'}>
        {todos.map((todo) => {
          return <Item todo={todo} />
        })}
      </ul>
    </main>
  )
}

const Footer = ({ todos, filter }: { todos: Todo[]; filter: string | undefined }) => {
  const activeTodos = todos.filter((t) => !t.completed)

  return (
    <footer class={'footer'}>
      <span class={'todo-count'}>
        {activeTodos.length} {activeTodos.length > 1 ? 'items' : 'item'} left!
      </span>

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

      <form method={'post'} action={'/todos/all'}>
        <input type={'hidden'} name={'_action'} value={'clear-completed'} />
        <button class="clear-completed" type={'submit'}>
          Clear completed
        </button>
      </form>
    </footer>
  )
}
