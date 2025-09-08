// --- components/Assets/Assets.js ---
import React, { useState, useEffect } from 'react';
import './assets.css';

// Formata o valor para a moeda brasileira
const formatCurrency = (value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatQuantity = (qty) => Number(qty).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 });

// ***** NOVA FUNÇÃO DE TRADUÇÃO *****
const getFriendlyName = (key) => {
    const nameMap = {
        'brasil': 'Brasil',
        'eua': 'EUA',
        'cripto': 'Cripto',
        'stock': 'Ações',
        'etf': 'ETFs',
        'fixed_income': 'Renda Fixa',
        'criptomoedas': 'Criptomoedas' // Adicionado para consistência
    };
    // Converte a chave para minúsculas para garantir a correspondência
    return nameMap[key.toLowerCase()] || key;
};


const Accordion = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const childrenArray = React.Children.toArray(children).flat();
    const totalValue = childrenArray.reduce((sum, child) => sum + (child.props?.asset?.currentValue || 0), 0);

    return (
        <div className="asset-accordion">
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="header-left">
                    {/* Usa a função de tradução para o título */}
                    <h3>{getFriendlyName(title)}</h3> 
                    <span className="total-value">{formatCurrency(totalValue)}</span>
                </div>
                <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && <div className="accordion-content">{childrenArray}</div>}
        </div>
    );
};

const AssetItem = ({ asset }) => {
    const displayName = asset.ticker || asset.name;
    const displayQuantity = asset.totalQuantity ? ` (${formatQuantity(asset.totalQuantity)})` : '';
    return (
        <div className="asset-item">
            <p>{displayName}{displayQuantity}</p>
            <p>{formatCurrency(asset.currentValue)}</p>
        </div>
    );
};


const Assets = ({ assetsData, isLoading }) => {
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        if (assetsData && !activeTab && Object.keys(assetsData).length > 0) {
            setActiveTab(Object.keys(assetsData)[0]);
        }
        if (!assetsData && activeTab) {
            setActiveTab(null);
        }
    }, [assetsData, activeTab]);

    if (isLoading) {
        return (
            <div className="assets-container card">
                <h2>Meus Ativos</h2>
                <p>Carregando ativos...</p>
            </div>
        );
    }

    if (!assetsData || !activeTab || Object.keys(assetsData).length === 0) {
        return (
            <div className="assets-container card">
                <h2>Meus Ativos</h2>
                <p>Nenhum ativo na carteira para exibir.</p>
            </div>
        );
    }

    const tabKeys = Object.keys(assetsData);
    const activeTabData = assetsData[activeTab] || {};

    return (
        <div className="assets-container card">
            <h2>Meus Ativos</h2>

            <div className="tabs-container">
                {tabKeys.map(tabName => (
                    <button
                        key={tabName}
                        className={`tab-button ${activeTab === tabName ? 'active' : ''}`}
                        onClick={() => setActiveTab(tabName)}
                    >
                        {/* Usa a função de tradução para o texto do botão */}
                        {getFriendlyName(tabName)}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {Object.entries(activeTabData).length > 0 ? (
                    Object.entries(activeTabData).map(([subCategoryName, assets]) => (
                        <Accordion
                            key={subCategoryName}
                            // O título passado para o Accordion é a chave bruta
                            title={subCategoryName}
                            defaultOpen={true}
                        >
                            {assets && assets.length > 0 ? (
                                assets.map((asset, index) => (
                                    <AssetItem key={`${asset.ticker || asset.name}-${index}`} asset={asset} />
                                ))
                            ) : (
                                <p className="no-assets-message">Nenhum ativo nesta categoria.</p>
                            )}
                        </Accordion>
                    ))
                ) : (
                    <p className="no-assets-message">Nenhum ativo para exibir nesta categoria.</p>
                )}
            </div>
        </div>
    );
};

export default Assets;