import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AppToaster } from '../components/ui/toaster'
import { Provider } from '../components/ui/provider'


export default function App() {
  return (
    <ReduxProvider store={store}>
      <Provider>
        <RouterProvider router={router} />
        <AppToaster />
      </Provider>
    </ReduxProvider>
  )
}