import React, { useState } from 'react';
import './addAssetModal.css';

const AddAssetModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('buy');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Adicionar Ativo</h2>
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

                <form className="asset-form">
                    <div className="form-group">
                        <label htmlFor="asset-type">Tipo de Ativo</label>
                        <select id="asset-type">
                            <option value="crypto">Criptomoeda</option>
                            {/* Futuramente adicionar outros tipos */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="asset-name">Ativo</label>
                        <input type="text" id="asset-name" placeholder="Ex: Bitcoin" />
                    </div>
                     <div className="form-group">
                        <label htmlFor="asset-date">Data de {activeTab === 'buy' ? 'Compra' : 'Venda'}</label>
                        <input type="date" id="asset-date" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="asset-quantity">Quantidade</label>
                        <input type="number" id="asset-quantity" step="any" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="asset-price">Preço em Real (R$)</label>
                        <input type="number" id="asset-price" step="any" />
                    </div>
                     <div className="form-group">
                        <label htmlFor="asset-costs">Outros Custos (Opcional)</label>
                        <input type="number" id="asset-costs" step="any" />
                    </div>
                    <button type="submit" className="submit-button">Adicionar</button>
                </form>
            </div>
        </div>
    );
};

export default AddAssetModal;