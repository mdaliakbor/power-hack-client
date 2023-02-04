/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useDeleteBillMutation } from "../../feature/api/billApi";
import ButtonLoader from "../utils/loaders/ButtonLoader";


type Props = {
    show: boolean
    handleClose: () => void,
    id: string
}
const DeleteConfirmModal = (props: Props) => {
    const { show, handleClose, id } = props;

    const [deleteBill, { isLoading, isSuccess, isError, error }] = useDeleteBillMutation();

    const handleDelete = () => deleteBill(id)

    useEffect(() => {
        if (isSuccess) {
            toast.success('Bill deleted successfully!')
            handleClose();
        } else if (isError) {
            toast.error((error as any).data.message)
            // // console.log("request error", error);
        }
    }, [isError, isSuccess])
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete bill</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure Want to delete this bill?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleDelete} variant="danger" type="submit">
                    {isLoading ? <ButtonLoader /> : "Yes, Delete"}
                </Button>
                <Button variant="primary" type="button" onClick={handleClose}>
                    No, Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmModal;