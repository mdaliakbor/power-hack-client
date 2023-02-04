import { Spinner } from "react-bootstrap";
const AppLoader = () => {
    return (
        <div className="AppLoader">
            <Spinner animation="border" variant="dark" />
        </div>
    );
};

export default AppLoader;