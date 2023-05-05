import React, { useState } from 'react';
import config from '../../config.json';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://${config.server_host}:${config.server_port}/login?username=${encodeURIComponent(username)}&inputPassword=${encodeURIComponent(password)}`);
            const data = await response.text();
            console.log(data)
            if (data === '') {
                setMessage('Incorrect password. Please try again.');
            } else if (data === 'User not found'){
                setMessage('User not found, please check your username');
            } else {
                setMessage('Login successful!');
                navigate(`/user?name=${username}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('Error during login. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
            <div>For this assignment, you may try: owen &nbsp; 123; tracy &nbsp; 123; sunnie &nbsp; 123</div>
            <footer>Made by Ze Sheng, contact zesheng@seas.upenn.edu</footer>
        </div>
    );
};

export default Login;