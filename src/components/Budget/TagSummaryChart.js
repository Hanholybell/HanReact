import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const TagSummaryChart = ({ items }) => {
    const tagTotals = items.reduce((acc, item) => {
        if (item.amount < 0) { // 지출 항목만 계산
            const tag = item.subTag ? item.subTag.label : '태그 없음';
            acc[tag] = (acc[tag] || 0) + Math.abs(item.amount);
        }
        return acc;
    }, {});

    const totalExpense = Object.values(tagTotals).reduce((acc, value) => acc + value, 0);
    const percentages = Object.fromEntries(
        Object.entries(tagTotals).map(([key, value]) => [key, (value / totalExpense * 100).toFixed(2)])
    );

    const data = {
        labels: Object.keys(tagTotals),
        datasets: [
            {
                data: Object.values(tagTotals),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                    '#9966FF', '#FF9F40', '#9ACD32', '#D2691E', 
                    '#8A2BE2', '#FF4500', '#C71585', '#00CED1', 
                    '#DAA520', '#32CD32', '#8B0000', '#4682B4', 
                    '#B8860B', '#8B008B', '#3CB371', '#B0E0E6'
                ],
                hoverBackgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                    '#9966FF', '#FF9F40', '#9ACD32', '#D2691E', 
                    '#8A2BE2', '#FF4500', '#C71585', '#00CED1', 
                    '#DAA520', '#32CD32', '#8B0000', '#4682B4', 
                    '#B8860B', '#8B008B', '#3CB371', '#B0E0E6'
                ]
            }
        ]
    };

    const barData = {
        labels: Object.keys(percentages),
        datasets: [
            {
                label: '지출 퍼센트',
                data: Object.values(percentages),
                backgroundColor: Object.keys(tagTotals).map((_, index) => data.datasets[0].backgroundColor[index]),
                hoverBackgroundColor: Object.keys(tagTotals).map((_, index) => data.datasets[0].hoverBackgroundColor[index])
            }
        ]
    };

    const barOptions = {
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.raw + '%';
                    }
                }
            }
        }
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || '';
                        return label + ': ' + value;
                    }
                }
            }
        }
    };

    return (
        <div className="budget-manager__chart-container">
            <div className="budget-manager__chart">
                <Doughnut data={data} options={options} />
            </div>
            <div className="budget-manager__bar-chart">
                <Bar data={barData} options={barOptions} />
            </div>
        </div>
    );
};

export default TagSummaryChart;
