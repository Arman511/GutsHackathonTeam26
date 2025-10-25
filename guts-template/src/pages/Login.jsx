import { Link, useNavigate } from "react-router-dom";

import { setAccessToken } from "../main";
import { login } from "../api/api";

export default function Login() {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        console.log("Login attempt");
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get("username");
        const password = formData.get("password");

        const response = await login({ username: username, password: password });

        if (response.access_token) {
            setAccessToken(response.access_token);
            localStorage.setItem("access_token", response.access_token);
            navigate("/home");
        } else {
            console.error("Unable to login");
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
            <Link to="/home">Home</Link>
        </div>
    );
}
