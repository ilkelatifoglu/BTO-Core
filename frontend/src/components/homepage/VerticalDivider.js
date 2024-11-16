import React from 'react';

const VerticalDivider = () => {
    return (
        <div
            style={{
                width: '2px',
                backgroundColor: '#000000',
                borderRadius: '2px',
                margin: '0 20px',
                alignSelf: 'stretch', // Make divider stretch to full height
            }}
        />
    );
};

export default VerticalDivider;
