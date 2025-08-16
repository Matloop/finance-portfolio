import React, { useState, useEffect, useCallback } from 'react'; // Importe useCallback
import Dashboard from './components/Dashboard/Dashboard';
import Informations from './components/Informations/Informations';
import Assets from './components/Assets/Assets';
import AddAssetModal from './components/AddAssetModal/AddAssetModal';
import './App.css';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [summaryData, setSummaryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Envolvemos a lógica de busca de dados em uma função que pode ser reutilizada
    // useCallback garante que a função não seja recriada a cada renderização
    const fetchSummaryData = useCallback(async () => {
        setIsLoading(true); // Mostra o "Carregando..."
        try {
            const response = await fetch('http://localhost:8080/api/portfolio/summary');
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
    }, []); // O array vazio significa que a função nunca muda

    // Busca os dados na primeira vez que a página carrega
    useEffect(() => {
        fetchSummaryData();
    }, [fetchSummaryData]);

    // Esta função será chamada pelo modal após uma transação bem-sucedida
    const handleTransactionSuccess = () => {
        console.log("Transação bem-sucedida! Atualizando os dados...");
        fetchSummaryData(); // Re-busca os dados do sumário para atualizar a tela
        // No futuro, você também pode querer re-buscar a lista de ativos aqui
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Minha Carteira</h1>
                <button className="add-button" onClick={() => setIsModalOpen(true)}>Adicionar Ativo</button>
            </header>
            <main>
                <Informations summaryData={summaryData} isLoading={isLoading} />
                <Dashboard />
                <Assets />
            </main>
            {/* Passamos as novas props para o modal */}
            <AddAssetModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onTransactionSuccess={handleTransactionSuccess}
            />
        </div>
    );
}

export default App;