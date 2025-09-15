import React, {useState} from "react";
import api from "./api";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try{
            const response = await api.post(
                "/Auth/login", 
                {username, password},
                // {headers: {"Content-Type": "application/json"}}
                
            );
            
            const token =
                response?.data?.token ??
                response?.data?.Token ??
                response?.data?.access_token ??
                "";
            
            if (!token) {
                console.log("Login response:", response.data);
                setError("Giriş başarılı görünüyor ama token bulunamadı.");
                return;
            }

            localStorage.setItem("token", token);
            onLogin(token);
        }
        catch(err){
            console.log("Login error full:", err);
            console.log("Status:", err?.response?.status);
            console.log("Data:", err?.response?.data);

            if (err?.response) {
                // Sunucuya ulaştık ama 4xx/5xx döndü
                if (err.response.status === 401) {
                    setError("Sunucu 401 döndü: Kullanıcı adı veya şifre hatalı olabilir.");
                } else {
                    setError(
                        `Sunucu hatası (${err.response.status}): ${
                            err.response.data?.message || "Bilinmeyen hata"
                        }`
                    );
                }
            } else if (err?.request) {
                // İstek atıldı ama cevap gelmedi (CORS/sertifika/port hatası olası)
                setError("Sunucudan cevap alınamadı. CORS, port veya sertifika sorunu olabilir.");
            } else {
                // İstek bile atılamadı (kod tarafında hata)
                setError(`İstemci hatası: ${err.message}`);
            }
        }
    };
    
    return(
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl mb-4">StockWise Login</h2>
    
            <form onSubmit={handleSubmit} className={"flex flex-col gap-2"}>
                <input 
                    type = "text"
                    placeholder = "Kullanıcı adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded"
                />
    
                <input
                    type = "password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                />
                
                <button type={"submit"} className={"bg-blue-600 text-white p-2 rounded hover:bg-blue-700"}>
                    Gİriş Yap
                </button>
            </form>

            {error && <p className={"text-red-500 mt-2"}>{error}</p>}
        </div>
    );
}

export default Login;