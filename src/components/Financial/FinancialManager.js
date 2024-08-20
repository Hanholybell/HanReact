import React, { useState, useEffect } from 'react';
import '../../css/FinancialManager.css';

const FinancialManager = ({ selectedMonth, onMonthSelect }) => {
    const [income, setIncome] = useState(Array(12).fill(''));
    const [expenses, setExpenses] = useState(Array(12).fill(''));
    const [remaining, setRemaining] = useState(Array(12).fill(0));
    const [savingsGoals, setSavingsGoals] = useState(Array(12).fill(''));
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        loadFinancialData();
    }, [year]);

    useEffect(() => {
        calculateRemaining();
    }, [income, expenses]);

    const loadFinancialData = () => {
        const savedData = JSON.parse(localStorage.getItem(`financial-${year}`));
        if (savedData) {
            setIncome(savedData.income);
            setExpenses(savedData.expenses);
            setRemaining(savedData.remaining);
            setSavingsGoals(savedData.savingsGoals);
        } else {
            setIncome(Array(12).fill(''));
            setExpenses(Array(12).fill(''));
            setRemaining(Array(12).fill(0));
            setSavingsGoals(Array(12).fill(''));
        }
    };

    const calculateRemaining = () => {
        let previousRemaining = 0;

        // 이전 연도 12월 데이터를 가져옴
        const previousYearData = JSON.parse(localStorage.getItem(`financial-${year - 1}`));
        if (previousYearData && previousYearData.remaining) {
            const lastRemaining = previousYearData.remaining[11];
            if (typeof lastRemaining === 'string') {
                previousRemaining = parseFloat(lastRemaining.replace(/,/g, ''));
            } else if (typeof lastRemaining === 'number') {
                previousRemaining = lastRemaining;
            }
        }

        const newRemaining = income.map((inc, idx) => {
            const currentRemaining = previousRemaining + (parseFloat(inc.replace(/,/g, '')) || 0) - (parseFloat(expenses[idx].replace(/,/g, '')) || 0);
            previousRemaining = currentRemaining;
            return currentRemaining;
        });
        setRemaining(newRemaining);
    };

    const handleIncomeChange = (month, value) => {
        const newIncome = [...income];
        newIncome[month] = value;
        setIncome(newIncome);
    };

    const handleExpensesChange = (month, value) => {
        const newExpenses = [...expenses];
        newExpenses[month] = value;
        setExpenses(newExpenses);
    };

    const handleSavingsGoalChange = (month, value) => {
        const newSavingsGoals = [...savingsGoals];
        newSavingsGoals[month] = value;
        setSavingsGoals(newSavingsGoals);
    };

    const handleIncomeBlur = (month, value) => {
        const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        handleIncomeChange(month, formattedValue);
    };

    const handleExpensesBlur = (month, value) => {
        const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        handleExpensesChange(month, formattedValue);
    };

    const handleSavingsGoalBlur = (month, value) => {
        const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        handleSavingsGoalChange(month, formattedValue);
    };

    const calculateDifference = (remaining, goal) => {
        return remaining - (parseFloat(goal.replace(/,/g, '')) || 0);
    };

    const formatNumber = (number) => {
        return number.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
    };

    const saveData = () => {
        const financialData = {
            income,
            expenses,
            remaining,
            savingsGoals,
        };
        localStorage.setItem(`financial-${year}`, JSON.stringify(financialData));
        alert('데이터가 저장 되었습니다!');
    };

    const resetData = () => {
        setIncome(Array(12).fill(''));
        setExpenses(Array(12).fill(''));
        setRemaining(Array(12).fill(0));
        setSavingsGoals(Array(12).fill(''));
        localStorage.removeItem(`financial-${year}`);
    };

    return (
        <div className="financial-manager">
            <h1>Financial Manager - {year}</h1>
            <div>
                <label>Year: 
                    <select value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))}>
                        {[...Array(5).keys()].map(i => (
                            <option key={i} value={2024 + i}>
                                {2024 + i}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="financial-table">
                <div className="header">
                    <div>월</div>
                    <div>수입</div>
                    <div>지출</div>
                    <div>목표 저축금액</div>
                    <div>현재 잔액</div>
                    <div>차이 금액</div>
                </div>
                {Array(12).fill(null).map((_, idx) => (
                    <div key={idx} className="row">
                        <div>{idx + 1}</div>
                        <input 
                            type="text" 
                            value={income[idx]} 
                            onChange={(e) => handleIncomeChange(idx, e.target.value)} 
                            onBlur={(e) => handleIncomeBlur(idx, e.target.value)}
                            placeholder="0"
                        />
                        <input 
                            type="text" 
                            value={expenses[idx]} 
                            onChange={(e) => handleExpensesChange(idx, e.target.value)} 
                            onBlur={(e) => handleExpensesBlur(idx, e.target.value)}
                            placeholder="0"
                        />
                        <input 
                            type="text" 
                            value={savingsGoals[idx]} 
                            onChange={(e) => handleSavingsGoalChange(idx, e.target.value)} 
                            onBlur={(e) => handleSavingsGoalBlur(idx, e.target.value)}
                            placeholder="0"
                        />
                        <div>{formatNumber(remaining[idx])}</div>
                        <div className={calculateDifference(remaining[idx], savingsGoals[idx]) < 0 ? 'negative' : 'positive'}>
                            {formatNumber(calculateDifference(remaining[idx], savingsGoals[idx]))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="buttons">
                <button onClick={saveData}>저장</button>
                <button onClick={resetData}>초기화</button>
            </div>
        </div>
    );
};

export default FinancialManager;
