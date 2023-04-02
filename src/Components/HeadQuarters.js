import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from "react-router-dom";

export function HeadQuarters() {
    const [headquarters, setHeadquarters] = useState([]);
    const history = useHistory();


    useEffect(() => {
        axios.get('http://localhost:9000/headquarters', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setHeadquarters(response.data);
            })
            .catch(error => {
                window.location.href = '/login';
                console.log(error);
            });
    }, []);

    return (
        <section className="table-container">

            <h1>HEAD QUARTERS</h1>

            <table class="content-table">
                <thead>

                    <tr >
                        <th>hq_code</th>
                        <th>hq_name</th>
                        <th>phone_no</th>
                        <th>focus_unit_code</th>
                        <th>email</th>
                        <th>incharge_name</th>
                        <th>designation</th>

                    </tr>
                </thead>
                <tbody>
                    {headquarters.map(headquarter => (
                        <tr key={headquarter.hq_code} onClick={() => history.push(`/headquarters/${headquarter.hq_code}/bcc?headquarters=${headquarter.hq_name}`)}>
                            {/* <Link to={`/bcc/${bcc.bcc_code}/societies`}> */}
                            <td>{headquarter.hq_code}</td>
                            <td>{headquarter.hq_name}</td>
                            <td>{headquarter.phone_no}</td>
                            <td>{headquarter.focus_unit_code}</td>
                            <td>{headquarter.email}</td>
                            <td>{headquarter.incharge_name}</td>
                            <td>{headquarter.designation}</td>
                            {/* </Link> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
