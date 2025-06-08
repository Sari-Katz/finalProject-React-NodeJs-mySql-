import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import ApiUtils from '../../utils/ApiUtils';
import styles from './Login.module.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const apiUtils = new ApiUtils();

    const handleLogin = async () => {
        try {
            const data = await apiUtils.post('http://localhost:3000/users/login', { email, password });
            let user= data.user; // Assuming the response contains a user object
            console.log('User data:', user);
            const activeSubscription = await apiUtils.get(`http://localhost:3000/userSubscription/byUser/${user.id}`);
            console.log(activeSubscription)
            login({
            username: user.full_name,
            id: user.id,
            role: user.role
            });
           
            navigate(`/user/${user.id}/home`);
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'An error occurred during login');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button onClick={handleLogin}>Submit</button>
            {error && <div className={styles.error}>{error}</div>}
            <Link to="/register" className={styles.link}>Don't have an account? Sign Up</Link>
        </div>
    );
}

export default Login;
