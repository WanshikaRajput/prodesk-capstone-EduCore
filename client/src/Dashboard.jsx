import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;
const emptyForm = { title: '', description: '', price: '' };

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };

  const forceLogin = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Page khulte hi: token check + apne courses laao
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(localStorage.getItem('user')));
    } catch (e) {
      setUser(null);
    }

    fetch(API + '/api/courses', { headers: { Authorization: 'Bearer ' + token } })
      .then((res) => {
        if (res.status === 401) {
          forceLogin();
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not connect to server');
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD ya EDIT (editingId ho to PUT, warna POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const body = JSON.stringify({
      title: form.title,
      description: form.description,
      price: Number(form.price) || 0,
    });

    try {
      const url = editingId ? API + '/api/courses/' + editingId : API + '/api/courses';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: authHeaders,
        body,
      });

      if (res.status === 401) return forceLogin();
      const data = await res.json();
      if (!res.ok) return setError(data.message);

      if (editingId) {
        setCourses((prev) => prev.map((c) => (c._id === editingId ? data : c)));
      } else {
        setCourses((prev) => [data, ...prev]);
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setError('Could not connect to server');
    }
  };

  const startEdit = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      description: course.description || '',
      price: course.price,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // DELETE with optimistic UI: pehle list se hatao, API background me chale
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sire you want to delete?')) return;

    const oldList = courses;
    setCourses((prev) => prev.filter((c) => c._id !== id));

    try {
      const res = await fetch(API + '/api/courses/' + id, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.status === 401) return forceLogin();
      if (!res.ok) {
        const data = await res.json();
        setCourses(oldList); // fail hua to wapas laao
        setError(data.message);
      }
    } catch (err) {
      setCourses(oldList);
      setError('Delete fail hua, could not connect to server');
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '40px auto', padding: '0 12px' }}>
      <h2>Dashboard</h2>
      {user && (
        <p>
          Welcome, <b>{user.name}</b> ({user.email})
        </p>
      )}
      <button onClick={forceLogin}>Logout</button>

      <h3>{editingId ? 'Course edit karo' : 'Add a new course'}</h3>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <br /><br />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <br /><br />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
        <br /><br />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        )}
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>My Courses</h3>
      {loading && <p>Loading...</p>}
      {!loading && courses.length === 0 && <p>No course yet.</p>}
      <ul>
        {courses.map((c) => (
          <li key={c._id} style={{ marginBottom: 10 }}>
            <b>{c.title}</b> (Rs. {c.price}) <br />
            {c.description}
            <br />
            <button onClick={() => startEdit(c)}>Edit</button>{' '}
            <button onClick={() => handleDelete(c._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}