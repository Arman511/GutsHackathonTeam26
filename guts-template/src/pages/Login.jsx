import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { setAccessToken } from "../main";
import { login } from "../api/api";

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Login attempt");
        setError("");
        const formData = new FormData(event.target);
        const username = formData.get("username");
        const password = formData.get("password");

        try {
            const response = await login({ username: username, password: password });

            if (response && response.access_token) {
                setAccessToken(response.access_token);
                localStorage.setItem("access_token", response.access_token);
                navigate("/home");
            } else {
                setError("Invalid username or password");
                console.error("Unable to login");
            }
        } catch (e) {
            setError(e.message || "An error occurred during login");
            console.error(e);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card" role="main">
                <h1 id="login-heading" className="login-title">Welcome back</h1>
                <p className="login-sub">Sign in to continue</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="input-label">
                        <span>Username</span>
                        <input required name="username" type="text" className="input" placeholder="Username" />
                    </label>

                    <label className="input-label">
                        <span>Password</span>
                        <input required name="password" type="password" className="input" placeholder="Password" />
                    </label>

                    {error && <div className="error">{error}</div>}

                    <button type="submit" className="btn">Sign in</button>
                </form>

                <div className="login-footer">
                </div>
            </div>
        </div>
    );
}
