"use client";

import { Pacifico, Poppins } from "next/font/google";
import React, { useRef, useState, useEffect } from "react";
import { loginUser, signupUser, resetPassword } from "../utils/api/auth"; 
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { auth } from "../utils/firebase";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { googleProvider, facebookProvider } from "../utils/firebase";
import { useRouter } from "next/navigation"; 

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
});

const pacifico = Pacifico({
    subsets: ["latin"],
    weight: ["400"], 
    display: "swap" 
});

const Login = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            localStorage.setItem("user", currentUser.email);
            setUser(currentUser.email);
            router.replace("/");
          } else {
            localStorage.removeItem("user");
            setUser(null);
            router.replace("/login")
          }
        });
        return () => unsubscribe();
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const email = emailRef.current?.value.trim();
        const password = passwordRef.current?.value.trim();

        if (!email) {
            toast.error("Email is required");
            setLoading(false);
            return;
        }

        if (!password) {
            toast.error("Password is required");
            setLoading(false);
            return;
        }

        try {
            let user;
            if (isLogin) {
                user = await loginUser(email, password);
            } else {
                user = await signupUser(email, password);
            }

            if (typeof user === "string" && user.startsWith("Firebase:")) {
                toast.error(user.replace(/Firebase: auth\/|-/g, " "));
            } else {
                toast.success(`${isLogin ? "Login" : "Signup"} successful!`);
                router.push("/");
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }

        setLoading(false);
    };

    const handleForgotPassword = async () => {
        const email = emailRef.current?.value.trim();
        if (!email) {
            toast.error("Please enter your email to reset password");
            return;
        }

        try {
            await resetPassword(email);
            toast.success("Password reset email sent!");
        } catch (error) {
            toast.error(error.message || "Error sending reset email");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            toast.success(`Logged in as ${result.user.displayName}`);
            router.push("/");
        } catch (error) {
            toast.error(error.message || "Google login failed");
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            toast.success(`Logged in as ${result.user.displayName}`);
            router.push("/");
        } catch (error) {
            toast.error(error.message || "Facebook login failed");
        }
    };

    return (
        <div className={`${poppins.className} flex items-center justify-center min-h-screen bg-gray-100`}> 
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className={`text-2xl font-bold text-center ${pacifico.className}`}>
                    {isLogin ? "Login" : "Signup"}
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            ref={emailRef}
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            ref={passwordRef}
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {isLogin && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 font-medium text-white rounded-md ${
                            isLogin
                                ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-200"
                                : "bg-green-600 hover:bg-green-700 focus:ring-green-200"
                        } focus:outline-none focus:ring`}
                    >
                        {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
                    </button>
                </form>
                
                <p className="text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 hover:underline">
                        {isLogin ? "Sign up" : "Log in"}
                    </button>
                </p>
                <div className="flex flex-col space-y-3">
                    <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center w-full px-4 py-2 text-black border rounded-md hover:bg-gray-100"
                    >
                        <FcGoogle className="mr-2" /> Sign in with Google
                    </button>
                    <button
                        onClick={handleFacebookLogin}
                        className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        <FaFacebook className="mr-2" /> Sign in with Facebook
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
