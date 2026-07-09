import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { queryClient } from './utils/queryClient'
import { store } from './store'

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </QueryClientProvider>
)
