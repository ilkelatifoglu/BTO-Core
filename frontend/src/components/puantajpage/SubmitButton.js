import React from 'react';
import { Button } from 'primereact/button';

function SubmitButton({ onClick }) {
    return (
        <div className="card flex justify-content-center">
            <Button label="Submit" onClick={onClick} />
        </div>
    );
}

export default SubmitButton;