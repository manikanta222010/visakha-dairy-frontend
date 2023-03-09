import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useHistory } from "react-router-dom";

export function MilkReceipts() {
    // const history = useHistory();

    const [producers, setProducers] = useState([]);

    useEffect(() => {
        axios.get('https://visakha-dairy-backend.onrender.com/milk-receipts')
            .then(response => {
                setProducers(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <section>

            <h1>MILK_RECEIPTS List</h1>
            <table class="content-table">
                <thead>
                    <tr>
                        <th>pno</th>

                    </tr>
                </thead>
                <tbody>
                    {producers.map(producer => (
                        <tr key={producer.pno}>
                            <td>{producer.pno}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
