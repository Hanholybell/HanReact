import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../../css/BudgetManager.css'; // 스타일을 위한 CSS 파일
import MonthlyOverview from './MonthlyOverview';
import TagSummaryChart from './TagSummaryChart'; // 새로운 그래프 컴포넌트
import CalendarView from './CalendarView';
import TagModal from './TagModal'; // TagModal import
import pixel10 from '../../assets/pixel10.gif';

// 아이콘 이미지 파일 import
import salaryIcon from '../../assets/salary.png';
import shoppingIcon from '../../assets/shopping.png';
import foodIcon from '../../assets/meal.png';
import transportIcon from '../../assets/station.png';
import housingIcon from '../../assets/house.png';
import entertainmentIcon from '../../assets/entertainment.png';
import clothingIcon from '../../assets/clothing.png';
import travelIcon from '../../assets/family.png';
import electronicsIcon from '../../assets/electronics.png';
import giftsIcon from '../../assets/present.png';
import snacksIcon from '../../assets/snaks.png';
import communicationIcon from '../../assets/communication.png';
import otherIcon from '../../assets/more.png';
import managerIcon from '../../assets/manager.png';
import graphIcon from '../../assets/graph.png';
import calendarIcon from '../../assets/calendar.png';
import moneyIcon from '../../assets/money.png';
import lossIcon from '../../assets/loss.png';

const mainTagOptions = [
    { value: 'income', label: '수익', icon: moneyIcon },
    { value: 'expense', label: '지출', icon: lossIcon }
];

const incomeSubTagOptions = [
    { value: 'salary', label: '급여', icon: salaryIcon },
    { value: 'other', label: '기타', icon: otherIcon } // 기타 항목 추가
];

const expenseSubTagOptions = [
    { value: 'shopping', label: '쇼핑', icon: shoppingIcon },
    { value: 'food', label: '음식', icon: foodIcon },
    { value: 'transport', label: '교통', icon: transportIcon },
    { value: 'housing', label: '주거', icon: housingIcon },
    { value: 'entertainment', label: '오락', icon: entertainmentIcon },
    { value: 'clothing', label: '의류', icon: clothingIcon },
    { value: 'travel', label: '여행', icon: travelIcon },
    { value: 'electronics', label: '전자제품', icon: electronicsIcon },
    { value: 'gifts', label: '선물', icon: giftsIcon },
    { value: 'snacks', label: '간식', icon: snacksIcon },
    { value: 'communication', label: '통신', icon: communicationIcon },
    { value: 'other', label: '기타', icon: otherIcon } // 기타 항목 추가
];

function BudgetManager({ selectedMonth, onMonthSelect }) {
    const [items, setItems] = useState(() => {
        const savedItems = localStorage.getItem(`budgetItems-${selectedMonth}`);
        return savedItems ? JSON.parse(savedItems) : [];
    });
    const [itemName, setItemName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [selectedMainTag, setSelectedMainTag] = useState(null);
    const [selectedSubTag, setSelectedSubTag] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);
    const [totalBalance, setTotalBalance] = useState(0);
    const [monthlyTotals, setMonthlyTotals] = useState({});
    const [viewMode, setViewMode] = useState('default'); // 'default', 'chart', 'calendar'
    const [isTagModalOpen, setIsTagModalOpen] = useState(false); // 모달 창 열기/닫기 상태

    useEffect(() => {
        const savedItems = localStorage.getItem(`budgetItems-${selectedMonth}`);
        if (savedItems) {
            const parsedItems = JSON.parse(savedItems);
            setItems(parsedItems.sort((a, b) => new Date(b.date) - new Date(a.date)));
            calculateTotalBalance(parsedItems);
        } else {
            setItems([]);
            setTotalBalance(0);
        }
    }, [selectedMonth]);

    useEffect(() => {
        localStorage.setItem(`budgetItems-${selectedMonth}`, JSON.stringify(items));
        calculateTotalBalance(items); // 아이템이 변경될 때마다 월별 총 잔액을 계산
    }, [items, selectedMonth]);

    useEffect(() => {
        calculateMonthlyTotals(); // 전체 월 총 잔액을 계산
    }, []);

    const addItem = () => {
        let itemAmount = parseFloat(amount);
        if (selectedMainTag?.value === 'expense') {
            itemAmount = -Math.abs(itemAmount); // 지출은 음수로 처리
        } else if (selectedMainTag?.value === 'income') {
            itemAmount = Math.abs(itemAmount); // 수익은 양수로 처리
        }

        if (isEditing) {
            const updatedItems = items.map((item, index) =>
                index === currentEditIndex ? { name: itemName, amount: itemAmount, date, mainTag: selectedMainTag, subTag: selectedSubTag } : item
            );
            setItems(updatedItems);
            setIsEditing(false);
            setCurrentEditIndex(null);
        } else {
            setItems([...items, { name: itemName, amount: itemAmount, date, mainTag: selectedMainTag, subTag: selectedSubTag }]);
        }
        setItemName('');
        setAmount('');
        setDate('');
        setSelectedMainTag(null);
        setSelectedSubTag(null);
    };

    const deleteItem = (index) => {
        if (window.confirm('삭제하시겠습니까?')) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const editItem = (index) => {
        setCurrentEditIndex(index);
        setIsEditing(true);
        setItemName(items[index].name);
        setAmount(Math.abs(items[index].amount).toString()); // 양수로 표시
        setDate(items[index].date);
        setSelectedMainTag(items[index].mainTag);
        setSelectedSubTag(items[index].subTag);
    };

    const handleItemNameChange = (e) => setItemName(e.target.value);
    const handleAmountChange = (e) => setAmount(e.target.value);
    const handleDateChange = (e) => setDate(e.target.value);
    const handleMainTagChange = (selectedOption) => {
        setSelectedMainTag(selectedOption);
        setSelectedSubTag(null); // 메인 태그가 변경될 때 서브 태그를 초기화
    };
    const handleSubTagChange = (selectedOption) => {
        setSelectedSubTag(selectedOption);
        setIsTagModalOpen(false); // 태그 선택 후 모달 창 닫기
    };

    const calculateTotalBalance = (items) => {
        const total = items.reduce((acc, item) => acc + item.amount, 0);
        setTotalBalance(total);
    };

    const calculateMonthlyTotals = () => {
        const allMonths = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];
        const totals = allMonths.reduce((acc, month) => {
            const savedItems = localStorage.getItem(`budgetItems-${month}`);
            if (savedItems) {
                const monthItems = JSON.parse(savedItems);
                const monthTotal = monthItems.reduce((total, item) => total + item.amount, 0);
                acc[month] = monthTotal;
            } else {
                acc[month] = 0;
            }
            return acc;
        }, {});
        setMonthlyTotals(totals);
    };

    const formatMonth = (month) => {
        const [year, monthNumber] = month.split('-');
        return `${parseInt(monthNumber)}월`;
    };

    const handleViewClick = () => {
        setViewMode('chart');
    };

    const handleCalendarClick = () => {
        setViewMode('calendar');
    };

    const handleDefaultClick = () => {
        setViewMode('default');
    };

    const getSubTagOptions = () => {
        if (selectedMainTag?.value === 'income') {
            return incomeSubTagOptions;
        } else if (selectedMainTag?.value === 'expense') {
            return expenseSubTagOptions;
        }
        return [];
    };

    const formatAmount = (amount) => {
        return amount.toLocaleString('en', { minimumFractionDigits: 0 });
    };

    const renderContent = () => {
        switch (viewMode) {
            case 'chart':
                return <TagSummaryChart items={items} />;
            case 'calendar':
                return <CalendarView items={items} />;
            default:
                return (
                    <ul className="budget-manager__item-list">
                        {items.map((item, index) => (
                            <li key={index} className="budget-manager__item">
                                <div className="budget-manager__item-date">{item.date}</div>
                                <div className="budget-manager__item-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50px' }}>
                                    <img src={item.subTag.icon} alt={item.subTag.label} style={{ width: '50px', height: '50px', marginLeft:'-44px' }} />
                                </div>
                                <div className={`budget-manager__item-name ${item.amount < 0 ? 'budget-manager__expense' : 'budget-manager__income'}`}>
                                    {item.name}
                                </div>
                                <div className="budget-manager__item-amount">￥{formatAmount(item.amount)}</div>
                                <button className="budget-manager__edit-btn" onClick={() => editItem(index)}>Edit</button>
                                <button className="budget-manager__delete-btn" onClick={() => deleteItem(index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                );
        }
    };

    return (
        <div className="budget-manager">
            <img src={pixel10} alt="Loading" className="budget-manager__pixel10gif" />
            <h2 className="budget-manager__header">BudgetManager ({selectedMonth})</h2>
            <div className="budget-manager__summary">
                <div className='budget-manager__summary-row'>
                    <div className="budget-manager__summary-item">
                        <span className='budget-manager__spend'>지출:</span>
                        <span className='budget-manager__value'>￥{formatAmount(items.filter(item => item.amount < 0).reduce((total, item) => total + item.amount, 0))}</span>
                    </div>
                    <div className="budget-manager__summary-item">
                        <span className='budget-manager__income'>수입:</span>
                        <span className='budget-manager__value'>￥{formatAmount(items.filter(item => item.amount > 0).reduce((total, item) => total + item.amount, 0))}</span>
                    </div>
                    <div className="budget-manager__summary-item">
                        <span className='budget-manager__balance'>{formatMonth(selectedMonth)} 잔액:</span>
                        <span className='budget-manager__value'>￥{formatAmount(totalBalance)}</span>
                    </div>
                </div>
            </div>
            <div className="budget-manager__select">
                <Select
                    className='budget-manager__select-bar'
                    value={selectedMainTag}
                    onChange={handleMainTagChange}
                    options={mainTagOptions}
                    placeholder="수익/지출 선택"
                />
                <div
                    className='budget-manager__select-bar'
                    onClick={() => setIsTagModalOpen(true)} // 모달 창 열기
                    style={{
                        border: '1px solid #ccc',
                        padding: '8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {selectedSubTag ? (
                        <>
                            <img src={selectedSubTag.icon} alt={selectedSubTag.label} style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                            <span>{selectedSubTag.label}</span>
                        </>
                    ) : '세부 태그 선택'}
                </div>
                <div className="budget-manager__menu-bar">
                    <div onClick={handleDefaultClick} className="budget-manager__menu-item">
                        <img src={managerIcon} alt="Manager" className="budget-manager__menu-icon" />
                        <span>Manager</span>
                    </div>
                    <div onClick={handleViewClick} className="budget-manager__menu-item">
                        <img src={graphIcon} alt="Graph" className="budget-manager__menu-icon" />
                        <span>Graph</span>
                    </div>
                    <div onClick={handleCalendarClick} className="budget-manager__menu-item">
                        <img src={calendarIcon} alt="Calendar" className="budget-manager__menu-icon" />
                        <span>Calendar</span>
                    </div>
                </div>
            </div>
            <div className="budget-manager__content-container">
                <div className="budget-manager__add-item-form">
                    <input
                        className='budget-manager__input'
                        type="text"
                        placeholder="Item Name"
                        value={itemName}
                        onChange={handleItemNameChange}
                    />
                    <input
                        className='budget-manager__input'
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                    <input
                        type="date"
                        placeholder="Date"
                        value={date}
                        onChange={handleDateChange}
                    />
                    <button onClick={addItem}>{isEditing ? 'Update Item' : 'Add Item'}</button>
                </div>
                {renderContent()}
            </div>
            <div className="budget-manager__overview-content">
                <MonthlyOverview 
                    onMonthSelect={onMonthSelect} 
                    monthlyTotals={monthlyTotals} // 전체 월의 총 잔액 전달
                />
            </div>
            <TagModal 
                isOpen={isTagModalOpen} 
                onClose={() => setIsTagModalOpen(false)} 
                onSelectTag={handleSubTagChange}
                tags={getSubTagOptions()}
            />
        </div>
    );
}

export default BudgetManager;
