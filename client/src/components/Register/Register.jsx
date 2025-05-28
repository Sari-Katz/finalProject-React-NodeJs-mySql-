import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import styles from './Register.module.css';
import ApiService from '../ApiSevice';
import { GoogleLogin } from '@react-oauth/google';
import { FacebookLoginButton } from 'react-social-login-buttons';

function Register() {
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const { userData, setUserData } = useUserContext();
    const [additionalInfo, setAdditionalInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const { username } = userData;
    const navigate = useNavigate();
    const apiService = new ApiService();

    const checkIfUserExists = async (username) => {
        try {
            const data = await apiService.fetch(`http://localhost:3000/users/${username}`);
            return data.length > 0;
        } catch (error) {
            console.error('Error checking user existence:', error);
            return false;
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const userExists = await checkIfUserExists(username);
        if (userExists) {
            setError('Username already exists');
            return;
        }

        handleCreateUser(e);
        setStep(2);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const newUser = {
            username,
            password,
            ...additionalInfo,
        };
        try {
            const user = await apiService.post(`http://localhost:3000/users`, newUser);
            setUserData({ username: user.username, id: user.id });
            localStorage.setItem('currentUser', JSON.stringify({ username: user.username, id: user.id }));
            navigate(`/user/${user.id}/home`);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.stepContainer}>
                <h2>Create Your Account</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
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
                        type="email"
                        placeholder="Email"
                        value={additionalInfo.email}
                        onChange={(e) => setAdditionalInfo({ ...additionalInfo, email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={additionalInfo.name}
                        onChange={(e) => setAdditionalInfo({ ...additionalInfo, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        value={additionalInfo.phone}
                        onChange={(e) => setAdditionalInfo({ ...additionalInfo, phone: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={additionalInfo.address}
                        onChange={(e) => setAdditionalInfo({ ...additionalInfo, address: e.target.value })}
                    />
                    <button type="submit">Sign Up</button>
                </form>
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.socialLogin}>
                    <h4>Or sign up with</h4>
                    <div className={styles.googleLogin}>
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                console.log("Google login success:", credentialResponse);
                            }}
                            onError={() => {
                                console.log("Google login failed");
                            }}
                        />
                    </div>
                    <FacebookLoginButton onClick={() => console.log("Facebook login clicked")} />
                </div>

                <Link to="/login" className={styles.link}>Already have an account? Log in</Link>
            </div>
        </div>
    );
}

export default Register;
