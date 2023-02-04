import { Spinner } from "react-bootstrap";

const ButtonLoader = () => {
    return (
        <>
            <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
            />
            Loading...
        </>
    );
};

export default ButtonLoader;