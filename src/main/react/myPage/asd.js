import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmployeeMonthlySalesChart = ({ salesByMonth }) => {
    // mock 데이터 생성
    const mockSalesByMonth = [
        { salesMonth: '1월', totalSales: 1500 },
        { salesMonth: '2월', totalSales: 2300 },
        { salesMonth: '3월', totalSales: 1800 },
        { salesMonth: '4월', totalSales: 2700 },
        { salesMonth: '5월', totalSales: 2200 },
        { salesMonth: '6월', totalSales: 3000 },
        { salesMonth: '7월', totalSales: 2500 },
        { salesMonth: '8월', totalSales: 3200 },
        { salesMonth: '9월', totalSales: 2800 },
        { salesMonth: '10월', totalSales: 3500 },
        { salesMonth: '11월', totalSales: 4000 },
        { salesMonth: '12월', totalSales: 4500 },
    ];

    // salesByMonth가 없으면 mock 데이터를 사용
    const salesData = salesByMonth && salesByMonth.length ? salesByMonth : mockSalesByMonth;

    // 데이터와 라벨 설정
    const labels = salesData.map(item => item.salesMonth);
    const chartData = salesData.map(item => item.totalSales);

    const data = {
        labels,
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
        responsive: true, // 반응형 설정
        maintainAspectRatio: false, // 비율 유지하지 않기
        scales: {
            x: {
                grid: { display: false }, // x축 그리드 비활성화
                ticks: { color: '#333', font: { size: 14, weight: 'bold' } } // x축 글꼴 스타일
            },
            y: {
                beginAtZero: true, // y축 0부터 시작
                grid: { color: '#e0e0e0' }, // y축 그리드 색상
                ticks: { color: '#333', font: { size: 14, weight: 'bold' } } // y축 글꼴 스타일
            }
        },
        plugins: {
            legend: { display: false }, // 범례 비활성화
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
            width: '100%', 
            height: '500px', 
            padding: '20px', // 컴포넌트 안쪽 여백
            backgroundColor: '#f9f9f9', // 컴포넌트 배경 색상
            borderRadius: '10px', // 컴포넌트 모서리 둥글기
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' // 컴포넌트 그림자
        }}>
            <h3 style={{ 
                textAlign: 'center', // 제목 가운데 정렬
                color: '#0056b3', // 제목 색상
                marginBottom: '20px', // 제목 아래 여백
                fontWeight: 'bold' // 제목 글꼴 두께
            }}>월별 매출액</h3>
            <Bar data={data} options={options} /> {/* Bar 컴포넌트 렌더링 */}
        </div>
    );
};

export default EmployeeMonthlySalesChart;
