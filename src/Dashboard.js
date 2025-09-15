import React, {useEffect, useState} from 'react';
// import axios from 'axios';
import api from "./api";
// import api from "./api";

function Dashboard() {
    const [portfolios, setPortfolios] = useState([]);
    const [error, setError] = useState("");
    
    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const res = await api.get("/Portfolio");
                setPortfolios(res.data);
            } catch (err) {
                console.error("Portföy yükleme hatası: ", err);
                setError("Portföyler yüklenirken hata oluştu.");
            }
        };
        fetchPortfolios();
    }, []);
    
    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">My Portfolios</h2>
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {portfolios.map((p) => (
                    <li key={p.id} className={"mb-2"}>
                        <strong>{p.name}</strong> (id: {p.id})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;