import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Transaction from "./pages/Transaction";
import HomeLayout from "./layouts/HomeLayout";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeLayout><HomePage/></HomeLayout>}/>
            <Route path="/dashboard" element={<HomeLayout><Transaction/></HomeLayout>}/>
            <Route path="/register" element={<Layout>{<Register/>}</Layout>}/>
            <Route path="/login" element={<Layout>{<Login/>}</Layout>}/>
            <Route path="/resetPassword" element={<Layout>{<ForgotPassword/>}</Layout>}/>
            <Route path="/*" element={<Layout>{<PageNotFound/>}</Layout>}/>
          </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
