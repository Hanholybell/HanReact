import React from 'react';

const CustomDate = () => {
    const currentDate = new Date().toLocaleString();
    return <div>{currentDate}</div>;
};

export default CustomDate;
