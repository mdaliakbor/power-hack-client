/* eslint-disable react-hooks/exhaustive-deps */
import { FormTextInput } from "../components/utils/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "react-bootstrap";
import AppLayout from "../layouts/AppLayout";
import { useLoginMutation } from "../feature/api/authApi";
import { useAppDispatch } from "../app/hooks";
import { login } from "../feature/slices/authSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ButtonLoader from "../components/utils/loaders/ButtonLoader";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
    email: z.string().email("Enter a valid email address!"),
    password: z.string().min(8, "Password must be at least 8 characters!")
})

type FormData = z.infer<typeof schema>

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [signin, { data, isLoading, isSuccess, isError, error }] = useLoginMutation();

    const loginHandler = (data: FormData) => signin(data)

    useEffect(() => {
        if (isSuccess) {
            toast.success('login successfully!')
            const { username = "", email = "", avatar = "" } = data.data.user;
            dispatch(login({ username, email, avatar }));
            navigate("/", { replace: true })
        } else if (isError) {
            toast.error((error as any).data.message)
            // // console.log("request error", error);
        }
    }, [isError, isSuccess])

    return (
        <AppLayout>
            <div className="row">
                <div className="col-md-5 mx-auto">
                    <div className="border rounded p-4">
                        <h3 className="display-6 text-center fs-3 mb-3">Login</h3>
                        <form onSubmit={handleSubmit(loginHandler)}>
                            <FormTextInput
                                label="Your email address"
                                name="email"
                                placeholder="Enter your email address"
                                register={register}
                                error={errors.email?.message}
                            />
                            <FormTextInput
                                label="Your password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                register={register}
                                error={errors.password?.message}
                            />
                            <div>
                                <p>You don't have an account? <Link to="/registration">Register Here</Link></p>
                            </div>
                            <Button variant="primary w-100" type="submit">
                                {isLoading ? <ButtonLoader /> : "Login"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Login;