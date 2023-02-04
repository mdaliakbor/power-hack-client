/* eslint-disable react-hooks/exhaustive-deps */
import { FormTextInput } from "../components/utils/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "react-bootstrap";
import AppLayout from "../layouts/AppLayout";
import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { useRegistrationMutation } from "../feature/api/authApi";
import ButtonLoader from "../components/utils/loaders/ButtonLoader";
import { toast } from "react-toastify";
import { login } from "../feature/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
    username: z.string().min(5, "Enter a valid username. Must be at least 5 characters!"),
    email: z.string().email("Enter a valid email address!"),
    password: z.string().min(8, "Password must be at least 8 characters!"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters!")
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Confirm password not matched!",
            path: ["confirmPassword"]
        })
    }
})

type FormData = z.infer<typeof schema>

const Registration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [registration, { data, isLoading, isSuccess, isError, error }] = useRegistrationMutation();

    const registrationHandler = (data: FormData) => registration(data);
    useEffect(() => {
        if (isSuccess) {
            toast.success('login successfully!')
            const { username = "", email = "", avatar = "" } = data.data.user;
            dispatch(login({ username, email, avatar }));
            navigate("/", { replace: true })
        } else if (isError) {
            toast.error((error as any).data.message)
        }
    }, [isError, isSuccess])
    return (
        <AppLayout>
            <div className="row">
                <div className="col-md-5 mx-auto">
                    <div className="border rounded p-4">
                        <h3 className="display-6 text-center fs-3 mb-3">Registration</h3>
                        <form onSubmit={handleSubmit(registrationHandler)}>
                            <FormTextInput
                                label="Your username"
                                name="username"
                                placeholder="Enter your username"
                                register={register}
                                error={errors.username?.message}
                            />
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
                            <FormTextInput
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                placeholder="Enter your confirm password"
                                register={register}
                                error={errors.confirmPassword?.message}
                            />
                            <div>
                                <p>Already have an account? <Link to="/login">Login Here</Link></p>
                            </div>
                            <Button variant="primary w-100" type="submit">
                                {isLoading ? <ButtonLoader /> : "Registration"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Registration;