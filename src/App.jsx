

import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Notfound from './Components/Notfound/Notfound'
import Men from './Components/Men/Men'
import Women from './Components/Women/Women'
import Kids from './Components/Kids/Kids'
import Carts from './Components/Carts/Carts'
import Home from'./Components/Home/Home'
import UserContextProvider from './Components/context/userContext'
import Loader from './Components/Loader/Loader'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import ProductDetails from'./Components/ProductDetails/ProductDetails'
import Handmade from'./Components/Handmade/Handmade'
import CartProvider from './Components/context/CartContext'
import Dashboard from './Components/Dashboard/Dashboard'
function App() {
  const routers = createBrowserRouter([


    { path: '', element: <Login /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },

    {
      path: '',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: 'home', element: <Home/> },
        { path: 'women', element: <Women /> },
        { path: 'men', element: <Men /> },
        { path: 'kids', element: <Kids /> },
           { path: 'handmade', element: <Handmade /> },
        { path: 'carts', element: <Carts /> },
     
  {
  path: 'dashboard',
  element: (
    <ProtectedRoute requireDashboard={true}>
      <Dashboard />
    </ProtectedRoute>
  )
},



         { path: 'product/:id', element: <ProductDetails /> }
      ],
    },

    { path: '*', element: <Notfound /> },

  ])

  return (
     <UserContextProvider>
  <CartProvider>
    <RouterProvider router={routers} />
  </CartProvider>
</UserContextProvider>

  )
}

export default App
