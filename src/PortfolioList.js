import React, {useEffect, useState} from 'react';
import api, {getPortfolios, createPortfolio} from "./api";
import {Link} from 'react-router-dom';

function PortfolioList() {
    const [portfolios, setPortfolios] = useState([]);
    const [listError, setListError] = useState('');
    const [newPortfolioName, setNewPortfolioName] = useState('');
    const [addError, setAddError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const fetchPortfolios = async () => {
        setListError('');
        try {
            const response = await getPortfolios();
            setPortfolios(response.data);
        } catch (error) {
            console.error("Couldn't find Portfolios", error);
            setListError("Portfolios could not be loaded.");
        }
    }
    
    useEffect(() => {
        fetchPortfolios();
    }, []);
    
    const handleAddPortfolio = async (e) => {
        e.preventDefault();
        if(!newPortfolioName.trim()) {
            setAddError('Portfolio name can not be empty');
            return;
        }
        setIsLoading(true);
        setAddError('');
        
        try {
            const response = await createPortfolio({name: newPortfolioName});
            setPortfolios([...portfolios, response.data]);
            setNewPortfolioName('');
        } catch (error) {
            console.error("Couldn't add Portfolio", error);
            setAddError('Failed to add Portfolio please try again');
        } finally {
            setIsLoading(false);
        }
    };
    
    
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Portfolios</h1>
            <form onSubmit={handleAddPortfolio} className="mb-6 flex gap-2 items-center">
                <input
                    type="text"
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                    placeholder="New Portfolio Name"
                    className="border p-2 rounded flex-grow"
                    disabled={isLoading}
                />
                <button type={"submit"} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400" disabled={isLoading}
                >
                    {isLoading ? 'Adding...' : 'Add Portfolio'}
                </button>
            </form>
            {addError && <p className={"text-red-500 mb-4"}>{addError}</p>}
            {listError && <p className={"text-red-500"}>{listError}</p>}
            {portfolios.length === 0 && !listError && <p>Loading portfolios or no portfolios found...</p>}
            
            <ul className="list-disc pl-5">
                {portfolios.map((p) => (
                    <li key={p.id} className={"mb-2"}>
                        <span className={"mr-2"}>{p.name}</span>
                        <Link to={`/portfolio/${p.id}`}>
                            <button className={"text-blue-500 hover:underline text-sm"}>
                                See Details
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PortfolioList;