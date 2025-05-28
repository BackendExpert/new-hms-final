import secureLocalStorage from 'react-secure-storage';
import * as jwtDecode from 'jwt-decode';

export function getUserInfoFromToken() {
    const token = secureLocalStorage.getItem('login');
    if (!token) return null;

    try {
        const decoded = jwtDecode.default(token);  // <-- call .default
        const role = decoded.role || (decoded.user && decoded.user.roles) || null;
        const username = (decoded.user && decoded.user.username) || null;
        const email = (decoded.user && decoded.user.email) || null;

        if (!role || !username || !email) {
            return null;
        }

        return { role, username, email };
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
}
