import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import ApiUtils from '../../utils/ApiUtils';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const handleLogin = async () => {
    try {
      const data = await ApiUtils.post('http://localhost:3000/users/login', { email, password });
      if (data && data.user) {
        const user = {
          full_name: data.user.full_name,
          email: data.user.email,
          id: data.user.id,
          role: data.user.role
        };
        login(user);
      }
    } catch (_error) {
      console.error('Login error:', _error);
      if (_error.status === 401) {
        setError('אימייל או סיסמה שגויים.');
      } else {
        setError(_error.message || 'אירעה שגיאה במהלך ההתחברות');
      }
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
