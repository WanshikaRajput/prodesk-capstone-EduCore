import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(API + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('Server se connect nahi ho paya');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '40px auto' }}>
      <h2>Register</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <br /><br />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <br /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <br /><br />
      <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Register'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Already account hai? <Link to="/login">Login</Link></p>
    </form>
  );
}