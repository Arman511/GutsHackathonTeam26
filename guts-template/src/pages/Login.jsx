import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DomeGallery from "./react-bits/DomeGallery";
import { setAccessToken } from "../main";
import { login } from "../api/api";
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await login({ username: email, password });

        if (response?.access_token) {
            setAccessToken(response.access_token);
            localStorage.setItem("access_token", response.access_token);
            navigate("/home");
        } else {
            alert("Invalid email or password");
        }
    };

    const handleSkip = () => {
        navigate('/home');
    };

    return (
        <div className="login-page">
            <DomeGallery />

            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>

                <button className="skip-button" onClick={handleSkip}>
                    Skip to Home
                </button>
            </div>
        </div>
    );
}
