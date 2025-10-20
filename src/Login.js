import React, { useState } from "react";
import api from "./api";

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
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 bg-skyy-300" style={{ backgroundColor: "white" }}>
            
            <header className="absolute top-0 mt-4">
                <h1 className="text-xl font-semibold">StockWise</h1>
            </header>

            <main className="w-full max-w-xs text-center">
                <h2 className="text-4xl font-bold mb-8">
                    Sign in to your account
                </h2>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-xl font-medium mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password-input" className="block text-xl font-medium mb-2">
                            Password
                        </label>
                        <input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-200"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                    
                    <div className="pt-1">
                        <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                            Forgot password?
                        </a>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default Login;