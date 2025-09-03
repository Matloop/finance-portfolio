// --- START OF FILE components/Dashboard/Dashboard.js ---
import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import './dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

// O componente agora recebe os dados prontos via props
const Dashboard = ({ percentagesData, isLoading }) => {
    const [pieChartFilter, setPieChartFilter] = useState('all');
    // Estados do gráfico de linha (ainda estático, precisa do endpoint de evolução)
    const [lineChartFilter, setLineChartFilter] = useState('all');
    const [lineChartTime, setLineChartTime] = useState('12m');

    // Estado para os dados do gráfico de pizza
    const [pieChartData, setPieChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#f7931a', '#3498db', '#27ae60'],
        }],
    });

    // O useEffect agora apenas formata os dados recebidos
    useEffect(() => {
        if (percentagesData) {
            setPieChartData({
                labels: ['Criptomoedas', 'Ações', 'Renda Fixa'],
                datasets: [{
                    data: [
                        percentagesData.criptoPercentage || 0,
                        percentagesData.stockPercentage || 0,
                        percentagesData.fixedIncomePercentage || 0,
                    ],
                    backgroundColor: ['#f7931a', '#3498db', '#27ae60'],
                }],
            });
        }
    }, [percentagesData]); // Reage quando os dados chegam do App.js

    // TODO: A lógica para buscar a evolução do patrimônio ainda precisa ser implementada
    // Ela pode permanecer aqui ou ser movida para o App.js também.
    const lineData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{ label: 'Evolução do Patrimônio', data: [1000, 1200, 1150, 1300, 1450, 1600, 1550, 1700, 1800, 1900, 2000, 2100], borderColor: '#1877f2', tension: 0.1 }],
    };

    return (
        <div className="dashboard-container">
            <div className="chart-card">
                <h2>Alocação de Ativos</h2>
                <div className="filters">
                    <select value={pieChartFilter} onChange={(e) => setPieChartFilter(e.target.value)}>
                        <option value="all">Todos</option>
                    </select>
                </div>
                {isLoading && <p>Carregando gráfico...</p>}
                {!isLoading && percentagesData && <Pie data={pieChartData} />}
                {!isLoading && !percentagesData && <p className="error-message">Não foi possível carregar os dados de alocação.</p>}
            </div>
            <div className="chart-card">
                <h2>Evolução do Patrimônio</h2>
                <div className="filters">
                    <select value={lineChartFilter} onChange={(e) => setLineChartFilter(e.target.value)}>
                        <option value="all">Todos</option>
                    </select>
                    <select value={lineChartTime} onChange={(e) => setLineChartTime(e.target.value)}>
                        <option value="12m">Últimos 12 meses</option>
                    </select>
                </div>
                {/* O gráfico de linha ainda usa dados estáticos por enquanto */}
                <Line data={lineData} />
            </div>
        </div>
    );
};

export default Dashboard;
