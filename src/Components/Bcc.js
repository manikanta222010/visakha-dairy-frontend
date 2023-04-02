import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useHistory, Link } from "react-router-dom";

export function Bcc() {
    const history = useHistory();
    const location = useLocation();
    const { hqCode } = useParams();

    const headquarters = new URLSearchParams(location.search).get('headquarters');

    const [bccs, setBcc] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:9000/headquarters/${hqCode}/bcc`)
            .then(response => {
                setBcc(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <section className="table-container">
            <h1>BCC</h1>

            <table class="content-table">
                <thead>

                    <tr>
                        <th>hq_code</th>
                        <th>hq_name</th>
                        <th>district_code</th>
                        <th>bcc_code</th>
                        <th>bcc_name</th>
                        <th>mis_bcc_code</th>
                        <th>production_bcc_code</th>
                        <th>bcc_address</th>
                        <th>entry_date</th>
                        <th>entry_time</th>
                        <th>s_no</th>
                        <th>bcc_nick_name</th>
                        <th>focus_bcc_code</th>
                        <th>focus_district_code</th>
                        <th>status</th>
                        <th>phone_no</th>
                    </tr>
                </thead>
                <tbody>
                    {bccs.map(bcc => (
                        <tr key={bcc.s_no} onClick={() => history.push(`/headquarters/${hqCode}/bcc/${bcc.bcc_code}/societies?headquarters=${headquarters}&bccName=${bcc.bcc_name}`)}>
                            {/* <Link to={`/bcc/${bcc.bcc_code}/societies`}> */}
                            <td>{bcc.hq_code}</td>
                            <td>{bcc.hq_name}</td>
                            <td>{bcc.district_code}</td>
                            <td>{bcc.bcc_code}</td>

                            <td>{bcc.bcc_name}</td>
                            <td>{bcc.mis_bcc_code}</td>
                            <td>{bcc.production_bcc_code}</td>
                            <td>{bcc.bcc_address}</td>
                            <td>{bcc.entry_date}</td>
                            <td>{bcc.entry_time}</td>
                            <td>{bcc.s_no}</td>
                            <td>{bcc.bcc_nick_name}</td>
                            <td>{bcc.focus_bcc_code}</td>
                            <td>{bcc.focus_district_code}</td>
                            <td>{bcc.status}</td>
                            <td>{bcc.phone_no}</td>
                            {/* </Link> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
