// src/components/MonthlySalesChart.js
import React, {useEffect, useState} from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmployeeMonthlySalesChart = ({salesByMonth}) => {
    console.log(salesByMonth);

    const label = [];
    const chartData = [];

    const setData = () => {
        if (salesByMonth !== null) salesByMonth.forEach(item => {label.push(item.salesMonth); chartData.push(item.totalSales)});
    }

    useEffect(() => {
        setData();
    }, []);

    const data = {
        labels: label,
        datasets: [{
            label: '매출액',
            data: chartData,
            backgroundColor: '#0056b3',
            borderRadius: 3,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#333' }
            },
            y: {
                beginAtZero: true,
                grid: { color: '#e0e0e0' },
                ticks: { color: '#333' }
            }
        },
        plugins: {
            legend: { display: false }
        }
    };

    return <Bar data={data} options={options} />;
};

export default EmployeeMonthlySalesChart;
