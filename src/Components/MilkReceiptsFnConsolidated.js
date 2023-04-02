import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useHistory } from "react-router-dom";

export function MilkReceiptsFnConsolidated() {
    // const history = useHistory();

    const [milkReceiptsFnConsolidated, setMilkReceiptsFnConsolidated] = useState([]);

    useEffect(() => {
        axios.get('https://visakha-dairy-backend.onrender.com/milk-receipts-fn-consolidated')
            .then(response => {
                setMilkReceiptsFnConsolidated(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <section>

            <h1>MILK_RECEIPTS_FN_CONSOLIDATED List</h1>
            <table class="content-table">
                <thead>
                    <tr>
                        <th>pno</th>

                    </tr>
                </thead>
                <tbody>
                    {milkReceiptsFnConsolidated.map(producer => (
                        <tr key={producer.pno}>
                            <td>{producer.pno}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
