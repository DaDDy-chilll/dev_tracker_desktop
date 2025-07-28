import { GlobalStateProvider } from './layouts'
import WindowControls from './components/WindowControls'
import './assets/tailwind.css'
import 'react-loading-skeleton/dist/skeleton.css'
import FullScreen from './features/full-screen'
import MiddleScreen from './features/middle-screen'
import TinyScreen from './features/tiny-screen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App(): React.JSX.Element {
  return (
    <GlobalStateProvider>
      <QueryClientProvider client={queryClient}>
        <WindowControls />
        <FullScreen />
        <MiddleScreen />
        <TinyScreen />
      </QueryClientProvider>
    </GlobalStateProvider>
  )
}

export default App
