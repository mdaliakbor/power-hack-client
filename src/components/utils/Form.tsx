import { Form } from "react-bootstrap";
import { UseFormRegister } from "react-hook-form";

type Props = {
    label?: string
    name: string
    error?: string
    register: UseFormRegister<any>
    type?: "text" | "password" | "email"
    placeholder?: string
    mbNone?: boolean
}

export const FormTextInput = (props: Props) => {
    const { label, name, error, register, type = "text", placeholder, mbNone } = props;
    return (
        <Form.Group className={mbNone ? "" : "mb-3"} controlId={name}>
            {label && <Form.Label>{label}</Form.Label>}
            <Form.Control
                type={type}
                placeholder={placeholder}
                {...register(name)}
            />
            {error &&
                <Form.Text className="text-danger">
                    {error}
                </Form.Text>
            }
        </Form.Group>
    )
}