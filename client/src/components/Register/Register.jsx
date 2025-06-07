import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import styles from './Register.module.css';
import ApiUtils from '../../utils/ApiUtils';
// import { GoogleLogin } from '@react-oauth/google';
// import { FacebookLoginButton } from 'react-social-login-buttons';

function Register() {
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState({
        full_name: '',
        email: '',
        phone: '',
    });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const apiUtils = new ApiUtils();

 const checkIfUserExists = async (email) => {
  try {
    const data = await apiUtils.fetch(`http://localhost:3000/users?email=${email}`);
    console.log('User data:', data);
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

const userExists = await checkIfUserExists(additionalInfo.email);
        if (userExists) {
            setError('Email already exists');
            return;
        }

        const newUser = {
            password,
            ...additionalInfo,
            role: 'user' // ניתן להוסיף פה תפקיד כברירת מחדל
        };

        try {
            const user = await apiUtils.post(`http://localhost:3000/users/register`, newUser);
            login({ username: user.full_name, id: user.id, role: user.role });
            navigate(`/about`);
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Failed to create user');
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

                {/* <div className={styles.socialLogin}>
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
                </div> */}

                <Link to="/login" className={styles.link}>Already have an account? Log in</Link>
            </div>
        </div>
    );
}

export default Register;
