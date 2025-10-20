import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {getPortfolioDetails, getPortfolios} from "./api";
import {
    PieChart, Pie, Cell,
    Tooltip, Legend, ResponsiveContainer
} from "recharts";


function PortfolioDetails() {
    const {portfolioId} = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [error, setError] = useState('');
    
    useEffect(() => {
        if(!portfolioId) {
            setError("Portfolio ID not found in URL.");
            return;
        }
        const fetchDetails = async () => {
            setError("");
            setDetails(null);
            try {
                const response = await getPortfolioDetails(portfolioId);
                setDetails(response.data);
            } catch (error) {
                console.error("Couldn't find Portfolio details", error);
                setError("Couldn't find Portfolio details");
            }
        };
        fetchDetails();
    }, [portfolioId]);
    
    const handleGoBack = () => {
        navigate("/portfolios");
    };
    
    if(error) {
        return (
            <div>
                <p style={{color:'red'}}>{error}</p>
                <button onClick={handleGoBack} style={{marginTop:"15px"}}>Back to Portfolio List</button>
            </div>
        );
    }
    
    if(!details) {
        return <p>Loading portfolio details...</p>;
    }
    const chartData = details.stocks.map((s) => ({
        name: s.symbol,
        value: s.totalValue,
    }));
    
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];
    
    return (
        <div className="portfolio-details p-4">
            <h2>{details.portfolioName}Details</h2>
            <p><strong>Total Value:</strong> ${details.totalValue.toFixed(2)}</p>
            
            <table className="table-auto border-collapse border border-slate-400 mt-4 w-full">
                <thead>
                <tr>
                    <th className={"border border-slate-300 p-2"}>Stock</th>
                    <th className={"border border-slate-300 p-2"}>Number</th>
                    <th className={"border border-slate-300 p-2"}>Current Price</th>
                    <th className={"border border-slate-300 p-2"}>Total Value</th>
                </tr>
                </thead>
                <tbody>
                {details.stocks.map((stock, index) => (
                    <tr key={index}>
                        <td className={"border border-slate-300 p-2"}>{stock.symbol}</td>
                        <td className={"border border-slate-300 p-2"}>{stock.quantity}</td>
                        <td className={"border border-slate-300 p-2"}>${stock.currentPrice.toFixed(2)}</td>
                        <td className={"border border-slate-300 p-2"}>${stock.totalValue.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            
            <button onClick={handleGoBack} className={"mt-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"}>
                Back to Portfolio List
            </button>
        </div>
    );
}

export default PortfolioDetails;