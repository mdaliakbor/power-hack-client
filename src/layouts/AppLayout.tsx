import { Dispatch, SetStateAction } from "react";
import AppBar from "../components/common/AppBar";

type Props = {
    children: React.ReactNode
    paidAmount?: number
}

const AppLayout = (props: Props) => {
    const { children, paidAmount } = props;
    return (
        <main>
            <AppBar paidAmount={paidAmount} />
            <div className="container my-5">
                {children}
            </div>
        </main>
    );
};

export default AppLayout;