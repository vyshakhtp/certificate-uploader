import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg('Invalid email or password.');
    } else {
      setErrorMsg('');
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login to CredHex</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMsg && <p className="error">{errorMsg}</p>}
        <button type="submit">Login</button>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </form>
    </div>
  );
}

export default Login;
