// Login.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5175/auth/google';
    };

    return (
        <div className="px-6 sm:px-[12rem] my-8">
            <h1 className="text-6xl text-[#2E7D32] my-4">Welcome</h1>
            <p className="mb-3 text-base">Welcome to miniStories 1.0.0 - beta</p>
            <p className="text-base mb-2">Post stories from the best and worst of your life and choose for them to be read by the world or completley private as your own personal diary</p>
            <hr className="h-px my-6 bg-gray-400 border-0"></hr>
            <button className="flex justify-center gap-3 w-[16rem] shadow-xs rounded bg-[#76ff03] py-2" onClick={handleGoogleLogin}>
                <div className="flex justify-center items-center pt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" width="14" height="14">
                        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
                </div>
                <p className="text-sm flex justify-center items-center">LOGIN WITH GOOGLE</p>
            </button>
        </div>
    );
};

export default Login;
