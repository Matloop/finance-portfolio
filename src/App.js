import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Informations from './components/Informations/Informations';
import Assets from './components/Assets/Assets';
import AddAssetModal from './components/AddAssetModal/AddAssetModal';
import './App.css';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estados para guardar os dados do sumário e controlar o carregamento
    const [summaryData, setSummaryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect com array vazio [] executa apenas uma vez, quando o componente é montado
    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                // Faz a chamada à sua API
                const response = await fetch('/api/portfolio/summary');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSummaryData(data); // Guarda os dados no estado
            } catch (e) {
                setError(e.message); // Guarda a mensagem de erro
                console.error("Falha ao buscar dados do sumário:", e);
            } finally {
                setIsLoading(false); // Finaliza o estado de carregamento
            }
        };

        fetchSummaryData();
    }, []);

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Minha Carteira</h1>
                <button className="add-button" onClick={() => setIsModalOpen(true)}>Adicionar Ativo</button>
            </header>
            <main>
                {/* Passa os dados e o estado de carregamento para o componente filho */}
                <Informations summaryData={summaryData} isLoading={isLoading} />
                <Dashboard />
                <Assets />
            </main>
            <AddAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default App;