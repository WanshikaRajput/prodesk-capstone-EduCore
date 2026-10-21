import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Token nahi hai -> seedha login par
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(localStorage.getItem('user')));
    } catch (e) {
      setUser(null);
    }

    fetch(API + '/api/courses', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then((res) => {
        // Token invalid ya expired -> clear karke login par
        if (res.status === 401) {
          localStorage.clear();
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setCourses(data);
      })
      .catch(() => {});
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <h2>Dashboard</h2>
      {user && <p>Welcome, <b>{user.name}</b> ({user.email})</p>}
      <h3>My Courses</h3>
      <ul>
        {courses.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
      <button onClick={logout}>Logout</button>
    </div>
  );
}