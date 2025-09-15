import React, {useEffect, useState} from "react";
import {getPortfolioDetails} from "./api";

function PortfolioDetails({portfolioId, onClose}) {
    const [details, setDetails] = useState(null);
    useEffect(() => {
        // console.log("Gelen portfolioId:",portfolioId);
        // if(!portfolioId){return;}
        const fetchDetails = async () => {
            try {
                const response = await getPortfolioDetails(portfolioId);
                setDetails(response.data);
            } catch (error) {
                console.error("Couldn't find Portfolio details", error);
            }
        };
        fetchDetails();
    }, [portfolioId]);
    
    if(!details) {
        return <p>Loading...</p>;
    }
    
    return (
        <div className="portfolio-details">
            <h2>{details.portfolioName}</h2>
            <p><strong>Total Value:</strong> ${details.totalValue.toFixed(2)}</p>
            
            <table border={"1"} cellPadding={"10"} style={{marginTop: "10px"}}>
                <thead>
                <tr>
                    <th>Stock</th>
                    <th>Number</th>
                    <th>Current Price</th>
                    <th>Total Value</th>
                </tr>
                </thead>
                <tbody>
                {details.stocks.map((stock, index) => (
                    <tr key={index}>
                        <td>{stock.symbol}</td>
                        <td>{stock.quantity}</td>
                        <td>${stock.currentPrice.toFixed(2)}</td>
                        <td>${stock.totalValue.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            
            <button onClick={onClose} style={{marginTop:"15px"}}>
                Close
            </button>
        </div>
    );
}

export default PortfolioDetails;