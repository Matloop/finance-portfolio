// --- START OF FILE components/Assets/Assets.js ---
import React, { useState } from 'react'; // Importe o useState
import './assets.css';

const AssetCategory = ({ title, color, children }) => {
    // O estado 'isOpen' precisa estar aqui dentro para que cada categoria seja controlada individualmente
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="asset-category">
            <div
                className="asset-header"
                style={{ borderLeftColor: color }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3>{title}</h3>
                <span>{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
                <div className="asset-content">
                    {children}
                </div>
            )}
        </div>
    );
};

const formatCurrency = (value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Assets = ({ assetsData, isLoading }) => {

    if (isLoading) {
        return (
            <div className="assets-container card">
                <h2>Meus Ativos</h2>
                <p>Carregando ativos...</p>
            </div>
        );
    }
    
    // ***** CORREÇÃO PRINCIPAL *****
    // Se, após o loading, os dados ainda não chegaram ou estão vazios, mostramos uma mensagem.
    // Isso previne o erro de tentar acessar propriedades de um objeto nulo.
    if (!assetsData) {
        return (
            <div className="assets-container card">
                <h2>Meus Ativos</h2>
                <p className="error-message">Não foi possível carregar os dados dos ativos.</p>
            </div>
        );
    }

    const { crypto, stock, fixedIncome } = assetsData;

    return (
        <div className="assets-container card">
            <h2>Meus Ativos</h2>
            <AssetCategory title="Criptomoedas" color="#f7931a">
                {crypto?.length > 0 ? (
                    crypto.map((asset) => (
                        <div key={asset.id} className="asset-item">
                            <p>{asset.ticker} ({asset.totalQuantity})</p>
                            <p>{formatCurrency(asset.currentValue)}</p>
                        </div>
                    ))
                ) : (
                    <p>Nenhuma criptomoeda na carteira.</p>
                )}
            </AssetCategory>
            <AssetCategory title="Ações" color="#3498db">
                {stock?.length > 0 ? (
                    stock.map((asset) => (
                        <div key={asset.id} className="asset-item">
                            <p>{asset.ticker} ({asset.totalQuantity})</p>
                            <p>{formatCurrency(asset.currentValue)}</p>
                        </div>
                    ))
                ) : (
                    <p>Nenhuma ação na carteira.</p>
                )}
            </AssetCategory>
            <AssetCategory title="Renda Fixa" color="#27ae60">
                {fixedIncome?.length > 0 ? (
                    fixedIncome.map((asset) => (
                        <div key={asset.id} className="asset-item">
                            <p>{asset.name}</p>
                            <p>{formatCurrency(asset.currentValue)}</p>
                        </div>
                    ))
                ) : (
                    <p>Nenhum ativo de renda fixa na carteira.</p>
                )}
            </AssetCategory>
        </div>
    );
};

export default Assets;
// --- END OF FILE components/Assets/Assets.js ---