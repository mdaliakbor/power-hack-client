/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

type PrivateTemplateProps = {
    children: React.ReactNode
}

const PrivateTemplate = (props: PrivateTemplateProps) => {
    const { children } = props;
    const { refresh, user: { email } } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    // console.log(refresh, email);

    useEffect(() => {
        if (refresh && !email) {
            navigate("/login", { replace: true })
        }
    }, [refresh])

    return refresh && email ? <>{children}</> : <></>
};

export default PrivateTemplate;