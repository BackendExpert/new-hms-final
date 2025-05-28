import { Navigate } from 'react-router-dom';

// Function to check if user is authenticated
const isAuthenticated = () => {
    return !!localStorage.getItem('login'); // Check for token in localStorage
};

const PrivateRoute = ({ element }) => {
    if (isAuthenticated()) {
        return element;
    } else {
        // Force page reload for /
        window.location.href = "/";
        return null; // Prevent rendering anything else
    }
};

export const logout = () => {
    localStorage.clear();
    window.location.reload()
};

export default PrivateRoute;