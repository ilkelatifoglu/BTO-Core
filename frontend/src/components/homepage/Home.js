import React from 'react';
import { Card } from 'primereact/card';

const Home = () => {
    return (
        <div className="flex justify-content-center align-items-center">
            <Card title="Card Title">
                <p>This is a card content styled with PrimeFlex utilities.</p>
            </Card>
        </div>
    );
};

export default Home;