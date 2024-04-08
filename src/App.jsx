import { BrowserRouter, Routes, Route } from "react-router-dom"
import Blog from "./component/Blog"
import LoginForm from "./component/Login"
import ProtectedRoute from "./component/protectedRoutes"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Blog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App