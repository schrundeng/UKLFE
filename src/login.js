import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage('Please enter your email and password.');
      return;
    }

    try {
      const response = await axios.post('http://172.16.100.39:8000/admin/auth', {
        email,
        password
      });

      console.log(response.data);

      if (response.data.status && response.data.logged) {
        setMessage('Login success');
        localStorage.setItem('token', response.data.token);
        onLogin();
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('error damn');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'lavenderblush' }}>
      <form
        onSubmit={handleLogin}
        style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '300px', backgroundColor: 'white' }}
      >
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box' }}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box' }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px',
            cursor: 'pointer',
            width: '100%',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Login
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
