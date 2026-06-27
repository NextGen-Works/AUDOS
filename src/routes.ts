import type { AppRoute } from './src/types/routes'

type RouteConfig = {
  path: string
  component: () => JSX.Element
  exact?: boolean
}

const routes: RouteConfig[] = [
  { path: '/', component: () => <div>Home</div>, exact: true },
  { path: '/audio', component: () => <div>Audio Player</div> },
  { path: '/parallax', component: () => <div>Parallax Visualizer</div> },
  { path: '/journal', component: () => <div>Journal</div> },
  { path: '/codex', component: () => <div>Codex</div> },
  { path: '/sigl', component: () => <div>SIGL Directory</div> },
  { path: '/settings', component: () => <div>Settings</div> },
]

export default routes
