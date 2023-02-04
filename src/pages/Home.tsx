/* eslint-disable react-hooks/exhaustive-deps */
import AppLayout from "../layouts/AppLayout";
import { Table, Button, Form } from "react-bootstrap";
import PrivateTemplate from "../templates/PrivateTemplate";
import { useState, useEffect } from "react";
import BillModal from "../components/modals/BillModal";
import { useGetAllBillQuery, useGetBillWithQueryMutation } from "../feature/api/billApi";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";


export type Bill = {
    _id: string,
    fullName: string,
    email: string,
    phone: string,
    payableAmount: number | string
}

const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [show, setShow] = useState(false);
    const [paidAmount, setPaidAmount] = useState(0);

    const handleClose = () => setShow(false);
    const [bills, setBills] = useState<Bill[]>([]);
    const [pageData, setPageData] = useState<{ currentPage: number, totalPage: number }>({
        currentPage: 1,
        totalPage: 0
    })

    const { data: billsData, isSuccess } = useGetAllBillQuery({});
    const [getBillWithQuery, { data, isLoading: isLoadingBill, isError: isErrorBill, isSuccess: isSuccessBill }] = useGetBillWithQueryMutation();

    useEffect(() => {
        setBills(billsData?.data?.bills || [])
        setPageData({
            currentPage: billsData?.currentPage || 1,
            totalPage: billsData?.pages || 0
        })
    }, [billsData, isSuccess])

    const handleNext = () => {
        const query = searchQuery.trim() !== "" ? `search=${searchQuery}&page=${pageData.currentPage + 1}` : `page=${pageData.currentPage + 1}`
        getBillWithQuery(query);
        setPageData(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
    const handlePrev = () => {
        const query = searchQuery.trim() !== "" ? `search=${searchQuery}&page=${pageData.currentPage - 1}` : `page=${pageData.currentPage - 1}`
        getBillWithQuery(query);
        setPageData(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }

    useEffect(() => {
        if (data && isSuccess) {
            setBills(data?.data?.bills || [])
            setPageData({
                currentPage: data?.currentPage || 1,
                totalPage: data?.pages || 0
            })
        }
    }, [data, isSuccess])
    const handleOnChange = (value: string) => {
        setSearchQuery(value);
        if (value.trim() !== "") {
            getBillWithQuery(`search=${value}`);
        } else {
            getBillWithQuery(``);
        }
    }
    return (
        <PrivateTemplate>
            <AppLayout paidAmount={paidAmount}>
                <BillModal
                    show={show}
                    handleClose={handleClose}
                    setBills={setBills}
                    data={{ id: "", fullName: "", email: "", phone: "", payableAmount: "" }}
                    type="adding"
                    title="Add new bill"
                    submitBtnText="Add"
                    setPaidAmount={setPaidAmount}
                    getBillWithQuery={getBillWithQuery}
                />
                <div>
                    <div className="d-flex justify-content-between algin-items-center mb-3 bg-light p-2 rounded">
                        <div className="d-flex algin-items-center">
                            <h3 className="display-6 fs-4 me-5">Billings</h3>
                            <div>
                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                    name="search"
                                    onChange={(e) => handleOnChange(e.target.value)}
                                    value={searchQuery}
                                />
                            </div>
                        </div>
                        <Button onClick={() => setShow(true)} variant="dark">Add New Bill</Button>
                    </div>
                    {bills.length > 0 ?
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Billing ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Paid Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map(bill =>
                                    <BillRow
                                        key={bill._id}
                                        id={bill._id}
                                        fullName={bill.fullName}
                                        email={bill.email}
                                        phone={bill.phone}
                                        payableAmount={bill.payableAmount}
                                    />
                                )}
                            </tbody>
                        </Table>
                        :
                        <div className="text-center mt-5">
                            <p>No billings found!</p>
                        </div>
                    }
                    {pageData.totalPage > 0 && bills.length > 0 &&
                        <div className="text-end">
                            <Button variant="dark" onClick={handlePrev} disabled={pageData.currentPage === 1}>Prev</Button>
                            <span className="mx-2">{pageData.currentPage} Of {pageData.totalPage}</span>
                            <Button variant="dark" onClick={handleNext} disabled={pageData.currentPage === pageData.totalPage}>Next</Button>
                        </div>
                    }
                </div>
            </AppLayout>
        </PrivateTemplate>
    );
};

export default Home;

export const BillRow = (props: { id: string, fullName: string, email: string, phone: string, payableAmount: number | string }) => {
    const { id, fullName, email, phone, payableAmount } = props;
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const handleCloseDeleteConfirmModal = () => setShowDeleteConfirmModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);
    return (
        <tr>
            <DeleteConfirmModal
                show={showDeleteConfirmModal}
                handleClose={handleCloseDeleteConfirmModal}
                id={id}
            />
            <BillModal
                show={showEditModal}
                handleClose={handleCloseEditModal}
                data={{ id, fullName, email, phone, payableAmount: payableAmount + "" }}
                type="updating"
                title="Update bill"
                submitBtnText="Save Changes"
            />
            <td>{id}</td>
            <td>{fullName}</td>
            <td>{email}</td>
            <td>{phone}</td>
            <td>{payableAmount}</td>
            <td>
                <Button className="me-2" onClick={() => setShowEditModal(true)}>Edit</Button>
                <Button variant="danger" onClick={() => setShowDeleteConfirmModal(true)}>Delete</Button>
            </td>
        </tr>
    )
}