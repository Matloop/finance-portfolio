import React, { useState } from 'react';
import './assets.css';

const AssetCategory = ({ title, color, children }) => {
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

const Assets = () => {
    return (
        <div className="assets-container card">
            <h2>Meus Ativos</h2>
            <AssetCategory title="Criptomoedas" color="#f7931a">
                <div className="asset-item">
                    <p>Bitcoin (BTC)</p>
                    <p>R$ 15.000,00</p>
                </div>
                <div className="asset-item">
                    <p>Ethereum (ETH)</p>
                    <p>R$ 5.000,00</p>
                </div>
            </AssetCategory>
            <AssetCategory title="Ações" color="#3498db">
                <p>Nenhuma ação na carteira.</p>
            </AssetCategory>
            <AssetCategory title="Renda Fixa" color="#27ae60">
                 <div className="asset-item">
                    <p>CDB PicPay 2026</p>
                    <p>R$ 10.000,00</p>
                </div>
            </AssetCategory>
        </div>
    );
};

export default Assets;