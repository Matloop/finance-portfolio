import React, { useState } from 'react';
import './addAssetModal.css';

// O componente agora recebe uma nova prop: `onTransactionSuccess`
const AddAssetModal = ({ isOpen, onClose, onTransactionSuccess }) => {
    // Estado para os campos do formulário
    const [activeTab, setActiveTab] = useState('buy');
    const [assetType, setAssetType] = useState('CRYPTO');
    const [ticker, setTicker] = useState('');
    const [quantity, setQuantity] = useState('');
    const [pricePerUnit, setPricePerUnit] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [otherCosts, setOtherCosts] = useState(''); // Opcional

    // Estado para feedback ao usuário
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    // Função para limpar o formulário e fechar o modal
    const handleClose = () => {
        setActiveTab('buy');
        setAssetType('CRYPTO');
        setTicker('');
        setQuantity('');
        setPricePerUnit('');
        setTransactionDate('');
        setOtherCosts('');
        setError(null);
        onClose(); // Chama a função do componente pai para fechar
    };

    // Função para lidar com a submissão do formulário
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o recarregamento da página

        // Validação simples
        if (!ticker || !quantity || !pricePerUnit || !transactionDate) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Monta o objeto (payload) para enviar à API
        const payload = {
            ticker: ticker.toUpperCase(),
            assetType,
            transactionType: activeTab.toUpperCase(),
            quantity: parseFloat(quantity),
            pricePerUnit: parseFloat(pricePerUnit),
            transactionDate,
        };
        
        try {
            const response = await fetch('http://localhost:8080/api/transactions', { // Endpoint para criar transações
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Tenta pegar uma mensagem de erro do backend
                const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
                throw new Error(errorData.message || `Erro: ${response.statusText}`);
            }

            // Se a transação foi um sucesso
            onTransactionSuccess(); // Chama a função de sucesso do componente pai
            handleClose(); // Fecha o modal e limpa o formulário

        } catch (err) {
            setError(err.message);
            console.error('Falha ao registrar transação:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={handleClose}>×</button>
                <h2>Adicionar Transação</h2>
                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === 'buy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('buy')}
                    >
                        Compra
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'sell' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sell')}
                    >
                        Venda
                    </button>
                </div>

                <form className="asset-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="asset-type">Tipo de Ativo</label>
                        <select id="asset-type" value={assetType} onChange={(e) => setAssetType(e.target.value)}>
                            <option value="CRYPTO">Criptomoeda</option>
                            <option value="STOCK">Ação</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="asset-ticker">Ativo / Ticker</label>
                        <input type="text" id="asset-ticker" placeholder="Ex: BTC, MGLU3" value={ticker} onChange={(e) => setTicker(e.target.value)} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="asset-date">Data da {activeTab === 'buy' ? 'Compra' : 'Venda'}</label>
                        <input type="date" id="asset-date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="asset-quantity">Quantidade</label>
                        <input type="number" id="asset-quantity" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="asset-price">Preço Unitário (R$)</label>
                        <input type="number" id="asset-price" step="any" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="asset-costs">Outros Custos (Opcional)</label>
                        <input type="number" id="asset-costs" step="any" placeholder="Taxas de corretagem, etc." value={otherCosts} onChange={(e) => setOtherCosts(e.target.value)} />
                    </div>
                    
                    {/* Exibe mensagens de erro */}
                    {error && <p className="error-message">{error}</p>}
                    
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Adicionando...' : 'Adicionar Transação'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAssetModal;