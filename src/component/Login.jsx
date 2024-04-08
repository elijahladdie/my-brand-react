import { useState } from 'react';
import axios from 'axios';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');


    const handleLogin = async (event) => {
        event.preventDefault();

        setEmailError('');
        setPasswordError('');


        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        // Validate password
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        }

        try {
            const response = await axios.post('https://my-brand-backend-vq8n.onrender.com/admin/access/login', {
                email: email,
                password: password
            });
            // Handle successful login
            console.log(response.data.message);
            localStorage.setItem('token', response.data.token);
            window.location.href = "/"

            // Redirect to dashboard or do any further action upon successful login
        } catch (error) {
            // Handle login error
            console.error(error.message);
            setEmailError('Invalid email or password');
        }
    };

    // Function to validate email format
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    return (
        <div id="skills" className="flex flex-col items-center hello-section justify-center h-screen">
            <h1 className="text-xl text-end">Login</h1>
            <div className="flex gap-8 flex-col bg-white pad w-96 rounded">
                <form className="" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label id="email-error" className="error-message">{emailError}</label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label id="password-error" className="error-message">{passwordError}</label>
                    </div>
                    <div className="form-group">
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
