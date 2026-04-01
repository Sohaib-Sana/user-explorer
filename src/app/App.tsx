import { Provider } from 'react-redux'
import { store } from './store'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AppToaster } from '../components/ui/toaster'


export default function App() {
  return (
    <Provider store={store}>
      <ChakraProvider  value={defaultSystem}>
        <RouterProvider router={router} />
        <AppToaster />
      </ChakraProvider>
    </Provider>
  )
}