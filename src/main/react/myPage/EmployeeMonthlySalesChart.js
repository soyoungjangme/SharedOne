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
            backgroundColor: '#0056b3', // 바의 기본 배경 색상
            borderRadius: 5, // 바의 모서리 둥글기
            borderWidth: 2, // 테두리 두께
            borderColor: '#003d80', // 테두리 색상
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#333', font: { size: 14, weight: 'bold' } } // x축 글꼴 스타일
            },
            y: {
                beginAtZero: true,
                grid: { color: '#e0e0e0' },
                ticks: { color: '#333', font: { size: 14, weight: 'bold' } } // y축 글꼴 스타일
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#fff', // 툴팁 배경 색상
                titleColor: '#0056b3', // 툴팁 제목 색상
                bodyColor: '#333', // 툴팁 내용 색상
                borderColor: '#0056b3', // 툴팁 테두리 색상
                borderWidth: 2, // 툴팁 테두리 두께
                padding: 10, // 툴팁 안쪽 여백
                titleFont: { size: 14, weight: 'bold' }, // 툴팁 제목 글꼴 스타일
                bodyFont: { size: 12 }, // 툴팁 내용 글꼴 스타일
                displayColors: false, // 툴팁 색상 표시 비활성화
            }
        }
    };

    return (
        <div style={{ 
            height: '500px', 
            borderRadius: '10px', // 컴포넌트 모서리 둥글기
            marginTop: '70px',
            padding: '20px'
        }}>
            <Bar data={data} options={options} /> {/* Bar 컴포넌트 렌더링 */}
        </div>
    );
};

export default EmployeeMonthlySalesChart;
