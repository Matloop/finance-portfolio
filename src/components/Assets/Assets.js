// --- components/Assets/Assets.js ---
import React, { useState, useEffect } from 'react';
import './assets.css'; // O CSS que fornecemos anteriormente está correto

// --- FUNÇÕES AUXILIARES (sem alterações) ---
const formatCurrency = (value = 0) => 
    `R$ ${Number(value).toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    })}`;

const formatQuantity = (qty = 0) => 
    Number(qty).toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 8 
    });

const getFriendlyName = (key) => {
    const nameMap = {
        'brasil': 'Brasil',
        'eua': 'EUA',
        'cripto': 'Cripto',
        'ações': 'Ações',
        'etfs': 'ETFs',
        'renda fixa': 'Renda Fixa',
        'criptomoedas': 'Criptomoedas'
    };
    return nameMap[key.toLowerCase()] || key;
};


// --- COMPONENTES REUTILIZÁVEIS (sem alterações) ---
const Accordion = ({ title, totalValue, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="asset-accordion">
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="header-left">
                    <h3>{getFriendlyName(title)}</h3>
                    <span className="total-value">{formatCurrency(totalValue)}</span>
                </div>
                <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && <div className="accordion-content">{children}</div>}
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


// --- COMPONENTE PRINCIPAL (COM A CORREÇÃO) ---
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
    // activeTabData agora é uma LISTA de objetos de subcategoria
    const activeTabData = assetsData[activeTab] || []; 

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
                        {getFriendlyName(tabName)}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {/* ***** CORREÇÃO PRINCIPAL APLICADA AQUI ***** */}
                {/* Agora iteramos sobre a LISTA de subcategorias */}
                {activeTabData.length > 0 ? (
                    activeTabData.map((subCategory) => (
                        <Accordion
                            key={subCategory.categoryName}
                            title={subCategory.categoryName}
                            totalValue={subCategory.totalValue}
                            defaultOpen={true}
                        >
                            {subCategory.assets && subCategory.assets.length > 0 ? (
                                subCategory.assets.map((asset, index) => (
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