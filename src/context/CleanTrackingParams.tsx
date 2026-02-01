import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CleanTrackingParams = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.search.includes("_ga") || location.search.includes("_gl")) {
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    return null;
};

export default CleanTrackingParams;