import secureLocalStorage from 'react-secure-storage';
import { jwtDecode } from 'jwt-decode';

export function getUserInfoFromToken() {
    const token = secureLocalStorage.getItem('login');
    // console.log("TOKEN FROM STORAGE:", token);
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        // console.log("DECODED TOKEN:", decoded);

        const username = decoded.username || decoded.user?.username || null;
        const email = decoded.email || decoded.user?.email || null;
        const roles = decoded.role || decoded.roles || decoded.user?.roles || [];

        if (!username || !email || roles.length === 0) {
            return null;
        }

        secureLocalStorage.setItem('loginE', email)

        return { username, email, roles };
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
}
