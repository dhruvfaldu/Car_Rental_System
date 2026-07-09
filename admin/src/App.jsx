import './App.css'
import AppRoutes from './routes/AppRoutes'
import { useMe } from '@/features/auth/hook/useMe'

function App() {
  useMe();

  return (
    <>
    <AppRoutes/>
    </>
  )
}

export default App
