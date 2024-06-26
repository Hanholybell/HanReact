import React from 'react';
import '../../css/MonthlyOverview.css';
import pixel11 from '../../assets/pixel11.gif';
import pixel12 from '../../assets/pixel12.gif';
import pixel13 from '../../assets/pixel13.gif';

function MonthlyOverview({ onMonthSelect, monthlyTotals = {} }) {
    const months = [
        '2024-01', '2024-02', '2024-03', '2024-04',
        '2024-05', '2024-06', '2024-07', '2024-08',
        '2024-09', '2024-10', '2024-11', '2024-12'
    ];

    const formatAmount = (amount) => {
        return amount.toLocaleString('en', { minimumFractionDigits: 0 });
    };

    const totalAmount = months.reduce((acc, month) => acc + (monthlyTotals[month] || 0), 0);

    return (
        <div className="monthly-overview">
            <h3>월별 지출 내역</h3>
            <div className="month-buttons">
                {months.map((month, index) => (
                    <button key={index} className="month-button" onClick={() => onMonthSelect(month)}>
                        {index + 1}월
                    </button>
                ))}
            </div>
            <div className="monthly-total">
                총 잔액: ￥{formatAmount(totalAmount)}
            </div>
            <img src={pixel11} alt="Loading" className="budget-manager__pixel11gif" />
            <img src={pixel13} alt="Loading" className="budget-manager__pixel13gif" />
            <img src={pixel12} alt="Loading" className="budget-manager__pixel12gif" />
        </div>
    );
}

export default MonthlyOverview;
