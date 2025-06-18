import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message.includes('registered') ? 'User already exists.' : error.message);
    } else {
      alert('Registration successful. Please log in.');
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register to CredHex</h2>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMsg && <p className="error">{errorMsg}</p>}
        <button type="submit">Register</button>
        <p>Already have an account? <a href="/">Login</a></p>
      </form>
    </div>
  );
}

export default Register;
