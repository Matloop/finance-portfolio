import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { API_BASE_URL } from '../../apiConfig'; // Importe a URL base da API
import './dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
    // Estados para os filtros
    const [pieChartFilter, setPieChartFilter] = useState('all');
    const [lineChartFilter, setLineChartFilter] = useState('all');
    const [lineChartTime, setLineChartTime] = useState('12m');

    // Estados para os dados do gráfico de pizza
    const [pieChartData, setPieChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#f7931a', '#3498db', '#27ae60'],
        }],
    });
    const [isLoadingPie, setIsLoadingPie] = useState(true);
    const [errorPie, setErrorPie] = useState(null);

    // useEffect para buscar os dados da API quando o componente montar
    useEffect(() => {
        const fetchAllocationData = async () => {
            setIsLoadingPie(true);
            setErrorPie(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/portfolio/assetPercentage`);
                if (!response.ok) {
                    throw new Error('Falha ao buscar dados de alocação da API.');
                }
                const data = await response.json();

                // Transforma os dados recebidos para o formato que o Chart.js espera
                setPieChartData({
                    labels: ['Criptomoedas', 'Ações', 'Renda Fixa'],
                    datasets: [{
                        data: [
                            data.criptoPercentage,
                            data.stockPercentage,
                            data.fixedIncomePercentage,
                        ],
                        backgroundColor: ['#f7931a', '#3498db', '#27ae60'],
                    }],
                });
            } catch (err) {
                setErrorPie(err.message);
                console.error(err);
            } finally {
                setIsLoadingPie(false);
            }
        };

        fetchAllocationData();
    }, []); // O array vazio [] garante que a busca ocorra apenas uma vez

    // Dados de exemplo para o gráfico de linha (ainda estático)
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
                        {/* Outras opções de filtro podem ser adicionadas aqui no futuro */}
                    </select>
                </div>
                {/* Renderização condicional para o gráfico de pizza */}
                {isLoadingPie && <p>Carregando gráfico...</p>}
                {errorPie && <p className="error-message">{errorPie}</p>}
                {!isLoadingPie && !errorPie && (
                    <Pie data={pieChartData} />
                )}
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
                <Line data={lineData} />
            </div>
        </div>
    );
};

export default Dashboard;