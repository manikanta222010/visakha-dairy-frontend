import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from "react-router-dom";

export function CattleInformation() {
    const history = useHistory();

    const { bccCode, societyCode, pno } = useParams();
    const [cattles, setCattles] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:9000/bcc/${bccCode}/societies/${societyCode}/producers/${pno}/cattle-information`)
            .then(response => {
                setCattles(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <section>

            <h1>CATTLE_INFORMATION List</h1>
            <table class="content-table">
                <thead>
                    <tr>
                        <th>pno</th>

                    </tr>
                </thead>
                <tbody>
                    {cattles.map(cattle => (
                        <tr key={cattle.pno}>
                            <td>{cattle.pno}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
