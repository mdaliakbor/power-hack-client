/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FormTextInput } from "../utils/Form";
import { useAddBillMutation, useUpdateBillMutation } from "../../feature/api/billApi";
import ButtonLoader from "../utils/loaders/ButtonLoader";
import { Bill } from "../../pages/Home";

const schema = z.object({
    fullName: z.string().min(1, "Full name is required!"),
    email: z.string().email("Enter a valid email address!"),
    phone: z.string().min(11, "Enter a valid phone number. Must be at last 11 characters!"),
    payableAmount: z.string().min(1, "Payable amount is required!"),
})

type FormData = z.infer<typeof schema>

type Props = {
    show: boolean
    handleClose: () => void
    setBills?: Dispatch<SetStateAction<Bill[]>>
    setPaidAmount?: Dispatch<SetStateAction<number>>
    data: {
        id: string
        fullName: string
        email: string
        phone: string
        payableAmount: string
    }
    title: string
    submitBtnText: string
    type: "adding" | "updating"
    getBillWithQuery?: any
}
const BillModal = (props: Props) => {
    const { show, handleClose, setBills, submitBtnText, title, type, data: { id, fullName, email, phone, payableAmount }, setPaidAmount, getBillWithQuery } = props;

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName,
            email,
            phone,
            payableAmount
        }
    });
    const [addBill, { isLoading: isLoadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error: addError }] = useAddBillMutation();
    const [updateBill, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: updateError }] = useUpdateBillMutation();

    const updateBillHandler = (data: FormData) => updateBill({ id, data })

    const addBillHandler = (data: FormData) => {
        addBill(data);
        handleClose();
        const bill = {
            ...data,
            _id: "Generating Id..."
        }
        setBills && setBills(prev => [bill, ...prev])
        const amount = +data.payableAmount || 0
        setPaidAmount && setPaidAmount(prev => prev + amount);
    }

    useEffect(() => {
        if (isSuccessAdd) {
            toast.success('New Bill added successfully!')
        } else if (isErrorAdd) {
            toast.error((addError as any).data.message)
            getBillWithQuery && getBillWithQuery()
        }

        if (isSuccessUpdate) {
            toast.success('Bill updated successfully!')
            handleClose();
        } else if (isErrorUpdate) {
            toast.error((updateError as any).data.message)
        }
    }, [isErrorAdd, isSuccessAdd, isSuccessUpdate, isErrorUpdate])
    return (
        <Modal show={show} onHide={handleClose}>
            <form onSubmit={handleSubmit(type === "adding" ? addBillHandler : updateBillHandler)}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormTextInput
                        label="Full name"
                        name="fullName"
                        placeholder="Enter full name"
                        register={register}
                        error={errors.fullName?.message}
                    />
                    <FormTextInput
                        label="Email address"
                        name="email"
                        placeholder="Enter a email address"
                        register={register}
                        error={errors.email?.message}
                    />
                    <FormTextInput
                        label="Phone number"
                        name="phone"
                        placeholder="Enter a phone number"
                        register={register}
                        error={errors.phone?.message}
                    />
                    <FormTextInput
                        label="Payable amount"
                        name="payableAmount"
                        placeholder="Enter amount"
                        register={register}
                        error={errors.payableAmount?.message}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        {isLoadingAdd || isLoadingUpdate ? <ButtonLoader /> : submitBtnText}
                    </Button>
                    <Button variant="danger" type="button" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </form>
        </Modal >
    );
};

export default BillModal;