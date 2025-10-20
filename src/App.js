import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import PortfolioList from "./PortfolioList";
import PortfolioDetails from "./PortfolioDetails";
import './App.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    const handleLogin = (newToken) => {
        setToken(newToken);
        navigate('/portfolios');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/login');
    };

    // ProtectedRoute'u tanımlı bırakıyoruz ama şimdilik kullanmayacağız
    const ProtectedRoute = ({ children }) => {
        if (!token) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <div className="App">
            {token && (
                <header className="flex justify-between items-center mb-4 p-4 bg-gray-100 shadow">
                    <h1 className="text-xl font-bold">StockWise Dashboard</h1>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Logout</button>
                </header>
            )}

            <Routes>
                <Route
                    path="/login"
                    element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/portfolios" replace />}
                />

                {/* --- DEĞİŞİKLİK BURADA --- */}
                {/* ProtectedRoute sarmalayıcısını geçici olarak kaldırdık */}
                <Route
                    path="/portfolios"
                    element={
                    <ProtectedRoute>
                        <PortfolioList />
                    </ProtectedRoute>
                } // Doğrudan PortfolioList'i render ediyoruz
                />
                {/* --- DEĞİŞİKLİK SONU --- */}

                <Route
                    path="/portfolio/:portfolioId"
                    element={
                        <ProtectedRoute> {/* Detay sayfası korumalı kalsın */}
                            <PortfolioDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/"
                    element={token ? <Navigate to="/portfolios" replace /> : <Navigate to="/login" replace />}
                />
                
                <Route path="/test" element={<div>Test Sayfası Görünüyor mu?</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;

// import React, {useState} from 'react';
// import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
// import Login from './Login';
// import PortfolioList from "./PortfolioList";
// import PortfolioDetails from "./PortfolioDetails";
// import './App.css';
//
//
// function App() {
//  
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const navigate = useNavigate();
//  
//   const handleLogin = (newToken) => {
//     setToken(newToken);
//     navigate("/portfolios");
//   }
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     navigate("/login");
//   };
//  
// 
//   const ProtectedRoute = ({children}) => {
//     if(!token) {
//         console.log("Protected Route: no token redirecting login")
//       return <Navigate to="/login" replace />;
//     }
//       console.log("ProtectedRoute: Token found, rendering children");
//     return children;
//   };
//  
//   return (
//     <div className="App">
//       {token && (
//         <header className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-bold">StockWise Dashboard</h1>
//           <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
//         </header>
//       )}
//       <Routes>
//         <Route path="/login" 
//                element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/portfolios" replace />} 
//         />
//         <Route path="/portfolios"
//                elment={
//                     <ProtectedRoute>
//                       <PortfolioList/>
//                     </ProtectedRoute>
//                }
//         />
//        
//         <Route path="portfolios/:portfolioId" 
//                element={
//                     <ProtectedRoute>
//                       <PortfolioDetails />
//                     </ProtectedRoute>
//                }
//         />
//         <Route path="/"
//                element={token ? <Navigate to="portfolios" replace /> : <Navigate to="login" replace />}
//         />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div>
//   );
// }
//
// export default App;
