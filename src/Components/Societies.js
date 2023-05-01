import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from "react-router-dom";

export function Societies() {
    const history = useHistory();
    const location = useLocation();
    const headquarters = new URLSearchParams(location.search).get('headquarters');
    const bccName = new URLSearchParams(location.search).get('bccName');

    const { hqCode, bccCode } = useParams();
    const [societies, setSocieties] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:9000/headquarters/${hqCode}/bcc/${bccCode}/societies`)
            .then(response => {
                setSocieties(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <section className="table-container">

            <h1>SOCIETIES</h1>


            <table class="content-table">
                <thead>
                    <tr>
                        <th>bcc_code</th>
                        <th>society_code</th>
                        <th>society_name</th>
                        <th>society_type_code</th>
                        <th>lf_no</th>
                        <th>mis_code</th>
                        <th>president_name</th>
                        <th>secretary_name</th>
                        <th>society_server_code</th>
                        <th>entry_date</th>
                        <th>entry_time</th>
                        <th>status</th>
                        <th>address</th>
                        <th>phone_no</th>
                        <th>payment_district_code</th>
                    </tr>
                </thead>
                <tbody>
                    {societies.map(society => (
                        <tr key={society.bcc_code + society.society_code} onClick={() => history.push(`/headquarters/${hqCode}/bcc/${society.bcc_code}/societies/${society.society_code}/producers?headquarters=${headquarters}&bccName=${bccName}&societyName=${society.society_name}`)}>
                            <td>{society.bcc_code}</td>
                            <td>{society.society_code}</td>
                            <td>{society.society_name}</td>
                            <td>{society.society_type_code}</td>
                            <td>{society.lf_no}</td>
                            <td>{society.mis_code}</td>
                            <td>{society.president_name}</td>
                            <td>{society.secretary_name}</td>
                            <td>{society.society_server_code}</td>
                            <td>{society.entry_date}</td>
                            <td>{society.entry_time}</td>
                            <td>{society.status}</td>
                            <td>{society.address}</td>
                            <td>{society.phone_no}</td>
                            <td>{society.payment_district_code}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
