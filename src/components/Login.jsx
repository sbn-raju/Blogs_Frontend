import React from 'react'
import { useState } from 'react';
import { useAuth } from '../hooks/authHook.jsx'
import Popup from './Popup.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState();
    const navigate = useNavigate();
  
    const handleSubmit = async(e) => {
      e.preventDefault();
  
      await fetch(`${import.meta.env.VITE_API_PUBLISH_URL}/auth/login`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username:username,
          password:password
        }),
        credentials: 'include'
      }).then(async(result)=>{
        console.log(result);
        if(result.ok){
          const userData = await result.json();
          console.log(userData);
          login(userData.data, userData.token);
          navigate("/home");
        }else{
          const userError = await result.json();
          console.log(userError);
          setErrorMessage(userError.message);
        }
      }).catch((error)=>{
        console.log(error);
        console.log(error);
        setErrorMessage(error);
      });
      //console.log('Email:', username);
      //console.log('Password:', password);
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Collasyn Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-medium">Username</label>
              <input
                type="email"
                id="username"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
  
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                id="password"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
  
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            >
              Login
            </button>
          </form>
        </div>

        <Popup
        message={errorMessage}
        onClose={() => setErrorMessage(null)} // Close the popup
      />
      </div>
    );
}

export default Login