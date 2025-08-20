// --- START OF FILE AddAssetModal.js ---
import React, { useState } from 'react';
import './addAssetModal.css';
import { API_BASE_URL } from '../../apiConfig'; // Importe a URL base da API

// O componente agora recebe uma nova prop: `onTransactionSuccess`
const AddAssetModal = ({ isOpen, onClose, onTransactionSuccess }) => {
    // Estado para as abas do formulário (compra, venda, renda fixa)
    const [activeTab, setActiveTab] = useState('buy'); // 'buy', 'sell', 'fixedIncome'

    // --- Estados para os campos de Cripto/Ações ---
    const [assetType, setAssetType] = useState('CRYPTO'); // CRYPTO, STOCK
    const [ticker, setTicker] = useState('');
    const [quantity, setQuantity] = useState('');
    const [pricePerUnit, setPricePerUnit] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [otherCosts, setOtherCosts] = useState(''); // Opcional

    // --- Estados para os campos de Renda Fixa ---
    const [fiIssuer, setFiIssuer] = useState(''); // Emissor
    const [fiTitleType, setFiTitleType] = useState('CDB'); // Tipo de título: CDB, LCI, LCA, LC, LF, Tesouro Direto
    const [fiForm, setFiForm] = useState('POS_FIXADO'); // Forma: Pré-fixado, Pós-fixado, Híbrido
    const [fiIndexer, setFiIndexer] = useState('CDI'); // Indexador: CDI, IPCA, Selic, Pré-fixado
    const [fiPurchaseDate, setFiPurchaseDate] = useState(''); // Data da compra
    const [fiInitialValue, setFiInitialValue] = useState(''); // Valor em R$ (investido)
    const [fiDailyLiquidity, setFiDailyLiquidity] = useState(false); // Liquidez diária
    const [fiIndexerRate, setFiIndexerRate] = useState(''); // Taxa do CDI / % (Opcional)
    const [fiMaturityDate, setFiMaturityDate] = useState(''); // Data de vencimento

    // Estado para feedback ao usuário
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    // Função para limpar o formulário e fechar o modal
    const handleClose = () => {
        // Limpa estados de Cripto/Ações
        setActiveTab('buy');
        setAssetType('CRYPTO');
        setTicker('');
        setQuantity('');
        setPricePerUnit('');
        setTransactionDate('');
        setOtherCosts('');
        // Limpa estados de Renda Fixa
        setFiIssuer('');
        setFiTitleType('CDB');
        setFiForm('POS_FIXADO');
        setFiIndexer('CDI');
        setFiPurchaseDate('');
        setFiInitialValue('');
        setFiDailyLiquidity(false);
        setFiIndexerRate('');
        setFiMaturityDate('');

        setError(null);
        onClose(); // Chama a função do componente pai para fechar
    };

    // Função para lidar com a submissão do formulário
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o recarregamento da página

        setIsLoading(true);
        setError(null);

        try {
            if (activeTab === 'buy' || activeTab === 'sell') {
                // Lógica de submissão para Cripto/Ações
                if (!ticker || !quantity || !pricePerUnit || !transactionDate) {
                    setError('Por favor, preencha todos os campos obrigatórios para Cripto/Ações.');
                    setIsLoading(false);
                    return;
                }

                const payload = {
                    ticker: ticker.toUpperCase(),
                    assetType,
                    transactionType: activeTab.toUpperCase(),
                    quantity: parseFloat(quantity),
                    pricePerUnit: parseFloat(pricePerUnit),
                    transactionDate, // Use transactionDate para cripto/ações
                    otherCosts: otherCosts ? parseFloat(otherCosts) : null,
                };

                const response = await fetch(`${API_BASE_URL}/api/transactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
                    throw new Error(errorData.message || `Erro: ${response.statusText}`);
                }

            } else if (activeTab === 'fixedIncome') {
                // Lógica de submissão para Renda Fixa
                if (!fiIssuer || !fiTitleType || !fiForm || !fiIndexer || !fiPurchaseDate || !fiInitialValue || !fiMaturityDate) {
                    setError('Por favor, preencha todos os campos obrigatórios para Renda Fixa.');
                    setIsLoading(false);
                    return;
                }

                const fixedIncomePayload = {
                    issuer: fiIssuer,
                    titleType: fiTitleType,
                    form: fiForm,
                    indexer: fiIndexer,
                    purchaseDate: fiPurchaseDate, // Use fiPurchaseDate para RF
                    initialValue: parseFloat(fiInitialValue),
                    dailyLiquidity: fiDailyLiquidity,
                    indexerRate: fiIndexerRate ? parseFloat(fiIndexerRate) : null,
                    maturityDate: fiMaturityDate,
                };

                // Supondo um novo endpoint para Renda Fixa
                const response = await fetch(`${API_BASE_URL}/api/fixed-income-investments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fixedIncomePayload),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
                    throw new Error(errorData.message || `Erro: ${response.statusText}`);
                }
            }

            // Se a transação foi um sucesso (para qualquer tipo)
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
                    <button
                        className={`tab-button ${activeTab === 'fixedIncome' ? 'active' : ''}`}
                        onClick={() => setActiveTab('fixedIncome')}
                    >
                        Renda Fixa
                    </button>
                </div>

                <form className="asset-form" onSubmit={handleSubmit}>
                    {/* Renderização condicional dos campos com base na aba ativa */}
                    {(activeTab === 'buy' || activeTab === 'sell') && (
                        <>
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
                        </>
                    )}

                    {activeTab === 'fixedIncome' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="fi-issuer">Emissor</label>
                                <input type="text" id="fi-issuer" placeholder="Nome do emissor" value={fiIssuer} onChange={(e) => setFiIssuer(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fi-title-type">Tipo de Título</label>
                                <select id="fi-title-type" value={fiTitleType} onChange={(e) => setFiTitleType(e.target.value)}>
                                    <option value="CDB">CDB</option>
                                    <option value="LCI">LCI</option>
                                    <option value="LCA">LCA</option>
                                    <option value="LC">LC</option>
                                    <option value="LF">LF</option>
                                    <option value="TD">Tesouro Direto</option>
                                    {/* Adicione outros tipos conforme necessário */}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="fi-form">Forma (Opcional)</label>
                                <select id="fi-form" value={fiForm} onChange={(e) => setFiForm(e.target.value)}>
                                    <option value="POS_FIXADO">Pós-fixado</option>
                                    <option value="PRE_FIXADO">Pré-fixado</option>
                                    <option value="HIBRIDO">Híbrido</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="fi-indexer">Indexador</label>
                                <select id="fi-indexer" value={fiIndexer} onChange={(e) => setFiIndexer(e.target.value)}>
                                    <option value="CDI">CDI</option>
                                    <option value="IPCA">IPCA</option>
                                    <option value="SELIC">Selic</option>
                                    <option value="PREFIXADO">Pré-fixado</option>
                                    {/* Adicione outros indexadores */}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="fi-purchase-date">Data da compra</label>
                                <input type="date" id="fi-purchase-date" value={fiPurchaseDate} onChange={(e) => setFiPurchaseDate(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fi-initial-value">Valor em R$</label>
                                <input type="number" id="fi-initial-value" step="any" placeholder="0,00" value={fiInitialValue} onChange={(e) => setFiInitialValue(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fi-daily-liquidity">Liquidez diária</label>
                                <input type="checkbox" id="fi-daily-liquidity" checked={fiDailyLiquidity} onChange={(e) => setFiDailyLiquidity(e.target.checked)} />
                            </div>
                            {/* Mostra a taxa do indexador apenas se não for pré-fixado, ou se você quiser mostrar para todos */}
                            {fiIndexer !== 'PREFIXADO' && (
                                <div className="form-group">
                                    <label htmlFor="fi-indexer-rate">Taxa do {fiIndexer === 'CDI' ? 'CDI' : '%'}</label>
                                    <input type="number" id="fi-indexer-rate" step="any" placeholder="0,00" value={fiIndexerRate} onChange={(e) => setFiIndexerRate(e.target.value)} />
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="fi-maturity-date">Data de vencimento</label>
                                <input type="date" id="fi-maturity-date" value={fiMaturityDate} onChange={(e) => setFiMaturityDate(e.target.value)} />
                            </div>
                        </>
                    )}

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
// --- END OF FILE AddAssetModal.js ---