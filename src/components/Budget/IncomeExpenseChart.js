import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const IncomeExpenseChart = ({ items }) => {
    const totalExpenses = items
        .filter(item => item.amount < 0)
        .reduce((acc, item) => acc + Math.abs(item.amount), 0);

    const tagTotals = items.reduce((acc, item) => {
        if (item.amount < 0) { // 지출 항목만 계산
            const tag = item.subTag ? item.subTag.label : '태그 없음';
            acc[tag] = (acc[tag] || 0) + Math.abs(item.amount);
        }
        return acc;
    }, {});

    const data = {
        labels: Object.keys(tagTotals),
        datasets: [
            {
                data: Object.values(tagTotals),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FFCD56', '#C9CBCF'
                ],
                hoverBackgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FFCD56', '#C9CBCF'
                ]
            }
        ]
    };

    return (
        <div>
            <div className="chart-container">
                <Doughnut data={data} />
            </div>
            <div className="expense-summary">
                {Object.entries(tagTotals).map(([tag, total]) => (
                    <div className="expense-summary-item" key={tag}>
                        <span className="expense-summary-tag">{tag}</span>
                        <span className="expense-summary-value">￥{total.toLocaleString()}</span>
                        <div className="expense-summary-bar" style={{ backgroundColor: '#FF6384', width: `${(total / totalExpenses) * 100}%` }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncomeExpenseChart;
