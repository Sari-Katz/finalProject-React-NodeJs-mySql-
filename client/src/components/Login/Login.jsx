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
      console.log('Login successful:', data.user);
      if (data && data.user) {
        console.log('full:', data.user.full_name);
        const minimalUser = {
          full_name: data.user.full_name,
          email: data.user.email,
          id: data.user.id,
          role: data.user.role
        };

        login(minimalUser);
        // שומרים בלוקאל סטורג רק מזהה ותפקי
        // נווט לדף הבית או כל דף אחר
        navigate(`/user/home`);
      } else {
        setError(error.message || 'אירעה שגיאה במהלך ההתחברות');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'אירעה שגיאה במהלך ההתחברות');
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
