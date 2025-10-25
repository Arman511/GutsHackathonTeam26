import { Link } from "react-router-dom";

import { setAccessToken } from "../main";

export default function Login() {

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get("username");
        const password = formData.get("password");

        const response = await login(username, password);

        if (response.ok) {
            const data = await response.json();
            setAccessToken(data.access_token);
            navigate("/home");
        } else {
            console.error("Unable to login");
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            <form>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
            <Link to="/home">Home</Link>
        </div>
    );
}
