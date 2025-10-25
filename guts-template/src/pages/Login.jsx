import DomeGallery from "./react-bits/DomeGallery";
import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // import useNavigate

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // initialize navigate

    const handleSubmit = e => {
        e.preventDefault();
        console.log('Login submitted', { email, password });
        // You can navigate on successful login if desired
        // navigate('/home');
    };

    const handleSkip = () => {
        navigate('/home'); // go directly to /home
    };

    return (
        <div className="login-page" >
            <DomeGallery />
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
                <button type="button" className="skip-button" onClick={handleSkip} style={{ marginTop: '10px' }}>
                    Skip to Home
                </button>
            </div>
        </div>
    );
}
