import { Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react"
import AppLoader from "./components/utils/loaders/AppLoader";
import { useGetUserQuery } from "./feature/api/authApi";
import { login, refresher } from "./feature/slices/authSlice";

function App() {
  const { refresh } = useAppSelector(state => state.auth);
  const { data, isSuccess, isError } = useGetUserQuery({})
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!refresh) {
      if (isSuccess) {
        const { username = "", email = "", avatar = "" } = data.data.user;
        dispatch(login({ username, email, avatar }));
      } else if (isError) {
        dispatch(refresher());
      }
    }
  })
  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      {!refresh && <AppLoader />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;
