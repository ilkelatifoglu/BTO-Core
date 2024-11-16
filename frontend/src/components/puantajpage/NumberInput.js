import React from "react";
import { InputNumber } from 'primereact/inputnumber';

export default function NumeralsDemo({ value, onChange }) {
    return (
        <div className="flex-auto">
            <InputNumber
                inputId="integeronly"
                placeholder="Workload (in minutes)"
                value={value}
                onValueChange={(e) => onChange(e.value)}
            />
        </div>
    );
}
