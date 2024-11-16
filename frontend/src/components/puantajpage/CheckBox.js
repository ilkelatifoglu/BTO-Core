import React, { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import "./PuantajComponents.css";

export default function BasicDemo() {
    const [checked, setChecked] = useState(false);

    return (
        <div className="checkbox-container">
            <Checkbox onChange={e => setChecked(e.checked)} checked={checked}></Checkbox>
        </div>
    )
}
