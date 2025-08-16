import React, { useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import './dashboard.css';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);
const Dashboard = () => {
const [pieChartFilter, setPieChartFilter] = useState('all');
const [lineChartFilter, setLineChartFilter] = useState('all');
const [lineChartTime, setLineChartTime] = useState('12m');

// Dados de exemplo
const pieData = {
    labels: ['Cripto', 'Ações', 'Renda Fixa'],
    datasets: [
        {
            data: [40, 35, 25],
            backgroundColor: ['#f7931a', '#3498db', '#27ae60'],
        },
    ],
};

const lineData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
        {
            label: 'Evolução do Patrimônio',
            data: [1000, 1200, 1150, 1300, 1450, 1600, 1550, 1700, 1800, 1900, 2000, 2100],
            borderColor: '#1877f2',
            tension: 0.1,
        },
    ],
};

return (
    <div className="dashboard-container">
        <div className="chart-card">
            <h2>Alocação de Ativos</h2>
            <div className="filters">
                <select value={pieChartFilter} onChange={(e) => setPieChartFilter(e.target.value)}>
                    <option value="all">Todos</option>
                    <option value="crypto">Criptomoedas</option>
                    <option value="stocks">Ações</option>
                    <option value="fixed_income">Renda Fixa</option>
                </select>
            </div>
            <Pie data={pieData} />
        </div>
        <div className="chart-card">
            <h2>Evolução do Patrimônio</h2>
            <div className="filters">
                <select value={lineChartFilter} onChange={(e) => setLineChartFilter(e.target.value)}>
                    <option value="all">Todos</option>
                    <option value="crypto">Criptomoedas</option>
                    <option value="stocks">Ações</option>
                    <option value="fixed_income">Renda Fixa</option>
                </select>
                <select value={lineChartTime} onChange={(e) => setLineChartTime(e.target.value)}>
                    <option value="12m">Últimos 12 meses</option>
                    <option value="2y">Últimos 2 anos</option>
                    <option value="all">Desde o início</option>
                </select>
            </div>
            <Line data={lineData} />
        </div>
    </div>
);
};
export default Dashboard;