import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import styles from './Register.module.css';
import ApiUtils from '../../utils/ApiUtils';

function Register() {
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [additionalInfo, setAdditionalInfo] = useState({
        full_name: '',
        email: '',
        phone: '',
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        const newUser = {
            password,
            ...additionalInfo,
            role: 'user'
        };
        try {
            const user = await ApiUtils.post(`http://localhost:3000/users/register`, newUser);
            login(user);
            navigate(`/about`);
        } catch (error) {
               setError(`${error.body?.message}` || 'אירעה שגיאה במהלך ההתחברות');

        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.stepContainer}>
                <h2>Create Your Account</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={additionalInfo.full_name}
                        onChange={(e) => setAdditionalInfo({ ...additionalInfo, full_name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={additionalInfo.email}
                        onChange={(e) => setAdditionalInfo({ ...additionalInfo, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Phone"
                        value={additionalInfo.phone}
                        onChange={(e) => setAdditionalInfo({ ...additionalInfo, phone: e.target.value })}
                    />

                    <button type="submit">Sign Up</button>
                </form>
                {error && <div className={styles.error}>{error}</div>}
                <Link to="/login" className={styles.link}>Already have an account? Log in</Link>
            </div>
        </div>
    );
}

export default Register;
