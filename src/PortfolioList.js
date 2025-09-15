import React, {useEffect, useState} from 'react';
import {getPortfolios} from "./api";
import PortfolioDetails from "./PortfolioDetails";

function PortfolioList() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
    
    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const response = await getPortfolios();
                setPortfolios(response.data);
            } catch (error) {
                console.error("Couldn't find Portfolios", error);
            }
        };
        fetchPortfolios();
    },[]);
    
    return (
        <div>
            <h1>My Portfolios</h1>
            <ul>
                {portfolios.map((p) => (
                    <li key={p.id}>
                        {p.name}{" "}
                        <button onClick={() => setSelectedPortfolioId(p.id)}>
                            See Details
                        </button>
                    </li>
                ))}
            </ul>

            {selectedPortfolioId && (
                <PortfolioDetails
                    portfolioId={selectedPortfolioId}
                    onClose={() => setSelectedPortfolioId(null)}
                />
            )}
        </div>
    );
}

export default PortfolioList;