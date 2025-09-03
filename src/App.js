// --- START OF FILE App.js ---
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Informations from './components/Informations/Informations';
import Assets from './components/Assets/Assets';
import AddAssetModal from './components/AddAssetModal/AddAssetModal';
import { API_BASE_URL } from './apiConfig';
import './App.css';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);

    // CORREÇÃO: Removido 'isRefreshing' da lista de dependências do useCallback
    // A função de busca não muda quando 'isRefreshing' muda.
    const fetchDashboardData = useCallback(async () => {
        // Apenas 'isLoading' é usado para o spinner principal
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/portfolio/dashboard`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDashboardData(data);
        } catch (e) {
            setError(e.message);
            console.error("Falha ao buscar dados do dashboard:", e);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false); // Garante que o estado de refresh do botão seja resetado
        }
    }, []); // Array de dependências vazio

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData, dataRefreshTrigger]);

    const handleTransactionSuccess = () => {
        console.log("Transação bem-sucedida! Atualizando os dados...");
        setDataRefreshTrigger(prev => prev + 1);
    };

    // CORREÇÃO: Lógica do botão de refresh restaurada
    const handleRefreshAssets = async () => {
        setIsRefreshing(true); // Inicia o estado de 'Atualizando...'
        try {
            // 1. AVISA O BACKEND PARA ATUALIZAR AS COTAÇÕES
            const response = await fetch(`${API_BASE_URL}/api/portfolio/refresh`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Falha ao solicitar a atualização no backend.');
            }
            console.log('Backend notificado. Dando um tempo para processar e buscando novos dados...');

            // 2. DÁ UM PEQUENO TEMPO PARA O BACKEND PROCESSAR A ATUALIZAÇÃO
            setTimeout(() => {
                // 3. ACIONA O GATILHO PARA BUSCAR OS DADOS JÁ ATUALIZADOS
                setDataRefreshTrigger(prev => prev + 1);
            }, 2000); // 2 segundos de espera (ajuste se necessário)

        } catch (err) {
            console.error('Erro ao atualizar cotações:', err);
            alert('Não foi possível atualizar as cotações. Tente novamente.');
            setIsRefreshing(false); // Reseta o botão em caso de erro
        }
        // O setIsRefreshing(false) é chamado no 'finally' do fetchDashboardData
    };

    if (error && !dashboardData) {
        return <div className="error-message-full-page">Erro ao carregar os dados da carteira: {error}</div>;
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Minha Carteira</h1>
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
                <Informations summaryData={dashboardData?.summary} isLoading={isLoading} />
                <Dashboard percentagesData={dashboardData?.percentages} isLoading={isLoading} />
                <Assets assetsData={dashboardData?.assets} isLoading={isLoading} />
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
