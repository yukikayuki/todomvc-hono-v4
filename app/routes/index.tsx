import { createRoute } from 'honox/factory'
import { getTodos, Todo } from '../store'
import Item from '../islands/todo/item'
import { buildUrl } from '../utils/buildUrl'

export default createRoute(async (c) => {
  const searchParams = new URLSearchParams(new URL(c.req.url).search)

  const todos = await getTodos(searchParams.get('filter'))

  return c.render(<App todos={todos} searchParams={searchParams} />, { title: 'Todos' })
})

const App = async ({ todos, searchParams }: { todos: Todo[]; searchParams: URLSearchParams }) => {
  return (
    <div class={'todoapp'}>
      <Header searchParams={searchParams} />
      <Main todos={todos} searchParams={searchParams} />
      <Footer todos={todos} searchParams={searchParams} />
    </div>
  )
}

const Header = ({ searchParams }: { searchParams: URLSearchParams }) => {
  return (
    <header class={'header'}>
      <h1>todos</h1>
      <form class={'input-container'} method={'post'} action={buildUrl('/todos/new', searchParams)}>
        <input type={'hidden'} name={'_action'} value={'new-todo'} />
        <input name={'new-title'} class={'new-todo'} type={'text'} autofocus placeholder={'What needs to be done?'} />
      </form>
    </header>
  )
}

const Main = ({ todos, searchParams }: { todos: Todo[]; searchParams: URLSearchParams }) => {
  return (
    <main class={'main'}>
      <div class={'toggle-all-container'}>
        <form method={'post'} action={buildUrl('/todos/all', searchParams)}>
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

const Footer = ({ todos, searchParams }: { todos: Todo[]; searchParams: URLSearchParams }) => {
  const activeTodos = todos.filter((t) => !t.completed)

  const filter = searchParams.get('filter')
  console.log(searchParams.toString())

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

      <form method={'post'} action={buildUrl('/todos/all', searchParams)}>
        <input type={'hidden'} name={'_action'} value={'clear-completed'} />
        <button class="clear-completed" type={'submit'}>
          Clear completed
        </button>
      </form>
    </footer>
  )
}
