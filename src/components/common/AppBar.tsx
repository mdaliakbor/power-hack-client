/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useLogoutMutation } from '../../feature/api/authApi';
import { logout } from '../../feature/slices/authSlice';
import logo from '../../assets/logo.svg'
const AppBar = (props: { paidAmount?: number }) => {
    const { paidAmount } = props;
    const { user: { email } } = useAppSelector(state => state.auth);
    const [login, { isSuccess, isError, error }] = useLogoutMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        login({})
    }
    useEffect(() => {
        if (isSuccess) {
            toast.success('logout successfully!')
            dispatch(logout());
            navigate("/login", { replace: true })
        } else if (isError) {
            toast.error((error as any).data.message)
            // // console.log("request error", error);
        }
    }, [isError, isSuccess])
    return (
        <header>
            <Navbar bg="light" variant="light">
                <Container>
                    <NavLink to="/" className="navbar-brand"><img width="100px" src={logo}/></NavLink>
                    <Nav className="ms-auto">
                        
                        {email ?
                            <Button variant="primary" onClick={handleLogout}>Logout</Button>
                            :
                            <>
                                <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                    Login
                                </NavLink>
                                <NavLink to="/registration" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                    Registration
                                </NavLink>
                            </>
                        }
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
};

export default AppBar;