import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Informations from './components/Informations/Informations';
import Assets from './components/Assets/Assets';
import AddAssetModal from './components/AddAssetModal/AddAssetModal';
import { API_BASE_URL } from './apiConfig'; // Assumindo que você criou este arquivo
import './App.css';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [summaryData, setSummaryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Novo estado para controlar o loading do botão de refresh
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchSummaryData = useCallback(async () => {
        // Não mostra o "Carregando..." principal durante um refresh
        if (!isRefreshing) {
            setIsLoading(true);
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/portfolio/summary`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSummaryData(data);
        } catch (e) {
            setError(e.message);
            console.error("Falha ao buscar dados do sumário:", e);
        } finally {
            setIsLoading(false);
        }
    }, [isRefreshing]); // Adicionamos isRefreshing como dependência

    useEffect(() => {
        fetchSummaryData();
    }, [fetchSummaryData]);

    const handleTransactionSuccess = () => {
        console.log("Transação bem-sucedida! Atualizando os dados...");
        fetchSummaryData();
    };

    // Nova função para lidar com o clique no botão de refresh
    const handleRefreshAssets = async () => {
        setIsRefreshing(true); // Desabilita o botão e mostra o texto "Atualizando..."

        try {
            const response = await fetch(`${API_BASE_URL}/api/portfolio/refresh`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Falha ao solicitar a atualização no backend.');
            }

            console.log('Solicitação de refresh enviada. Atualizando dados em 2 segundos...');
            
            // Damos um tempo para o backend processar antes de buscar os novos dados
            setTimeout(() => {
                fetchSummaryData();
                // No futuro, você também pode querer atualizar a lista detalhada de ativos aqui
                setIsRefreshing(false); // Reabilita o botão
            }, 2000);

        } catch (err) {
            console.error('Erro ao atualizar cotações:', err);
            alert('Não foi possível atualizar as cotações. Tente novamente.');
            setIsRefreshing(false); // Reabilita o botão em caso de erro
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Minha Carteira</h1>
                {/* Agrupamos os botões para facilitar o layout */}
                <div className="header-actions">
                    <button 
                        className="refresh-button" 
                        onClick={handleRefreshAssets} 
                        disabled={isRefreshing || isLoading}
                    >
                        {isRefreshing ? 'Atualizando...' : 'Atualizar Cotações'}
                    </button>
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>
                        Adicionar Ativo
                    </button>
                </div>
            </header>
            <main>
                <Informations summaryData={summaryData} isLoading={isLoading} />
                <Dashboard />
                <Assets />
            </main>
            <AddAssetModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onTransactionSuccess={handleTransactionSuccess}
            />
        </div>
    );
}

export default App;