import React from 'react';
import '../../css/CalendarView.css'; // 스타일을 위한 CSS 파일

function CalendarView({ items }) {
    // 월별 날짜별로 아이템을 그룹화합니다.
    const groupedItems = items.reduce((acc, item) => {
        const date = new Date(item.date).getDate();
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
    }, {});

    // 달력의 일자를 생성합니다.
    const daysInMonth = new Date(2024, 6, 0).getDate(); // 6월은 30일까지 있음
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="calendar-view">
            <h3>월별 지출 달력</h3>
            <div className="calendar-view__grid">
                {calendarDays.map(day => (
                    <div key={day} className="calendar-view__day">
                        <div className="calendar-view__date">{day}</div>
                        {groupedItems[day] ? (
                            groupedItems[day].map((item, index) => (
                                <div key={index} className={`calendar-view__item ${item.amount < 0 ? 'calendar-view__expense' : 'calendar-view__income'}`}>
                                    ￥{item.amount}
                                </div>
                            ))
                        ) : (
                            <div className="calendar-view__empty">-</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CalendarView;
