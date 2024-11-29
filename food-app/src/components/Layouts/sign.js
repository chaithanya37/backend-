import React from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode library
import useUserStore from '../../useUserStore'; // Import Zustand store
import './sign.css';


const SignInPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser); // Zustand action to set user

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      console.log('Sign-in successful:', data);

      // Decode the token to extract user information
      const decodedToken = jwtDecode(data.token);
      console.log('Decoded token:', decodedToken);

      // Store user data in Zustand
      setUser({
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
       
      });
    
      // Redirect to another page (e.g., home)
      navigate('/');
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert(error.message);
    }
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit} className="signin-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="form-input"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="form-input"
          required
        />
        <button type="submit" className="signin-button">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
