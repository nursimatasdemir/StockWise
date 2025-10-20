import React, { useState } from "react";
import api from "./api";
import { ReactComponent as Logo } from './logo.svg'; // Projenin kendi SVG logosunu kullanabiliriz

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Yükleniyor durumu için

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Backend'in beklediği DTO ile eşleşen veri
            const response = await api.post(
                "/Auth/login",
                { username, password }
            );

            // Token'ı yanıttan alıyoruz
            const token = response?.data?.token;

            if (!token) {
                console.log("Login response:", response.data);
                setError("Giriş başarılı görünüyor ama token bulunamadı.");
                return;
            }

            localStorage.setItem("token", token);
            onLogin(token); // App component'indeki state'i güncelle
        } catch (err) {
            console.log("Login error full:", err);
            if (err?.response) {
                if (err.response.status === 401) {
                    setError("Kullanıcı adı veya şifre hatalı.");
                } else {
                    setError(`Sunucu hatası (${err.response.status}): ${err.response.data?.message || "Bilinmeyen hata"}`);
                }
            } else if (err?.request) {
                setError("Sunucudan cevap alınamadı. Backend'in çalıştığından emin olun.");
            } else {
                setError(`İstemci hatası: ${err.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 space-y-8 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <span className="text-2xl font-semibold ml-2 text-gray-800">StockWise</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label htmlFor="username" className="text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <div className="relative mt-1">
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                
                    <div className="relative">
                        <label htmlFor="password-input" className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                id="password-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {/* Hata Mesajı Alanı */}
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    {/* Giriş Butonu */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>

                    {/* Şifremi Unuttum Linki */}
                    <div className="text-sm text-center">
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot password?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;