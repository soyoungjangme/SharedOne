// src/components/MonthlySalesChart.js
import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlySalesChart = ({ salesByMonth }) => {
    console.log(salesByMonth);

    const label = [];
    const chartData = [];

    
    // useEffect(() => {
    //     salesByMonth.forEach(item => {
    //         label.push(item.salesMonth);
    //         chartData.push(item.totalSales);
    //     });
    //     console.log(label);
    //     console.log(chartData);
    // }, [salesByMonth]);


    //이 코드로
    //차트 부분이 오류나서 아래코드로 사용해보는중
    useEffect(() => {
        if (salesByMonth) {
            salesByMonth.forEach(item => {
                label.push(item.salesMonth);
                chartData.push(item.totalSales);
            });
        }
        console.log(label);
        console.log(chartData);
    }, [salesByMonth]);
    

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

        //차트 비율 유지하기
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

export default MonthlySalesChart;
