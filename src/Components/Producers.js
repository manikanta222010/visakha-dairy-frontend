import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from "react-router-dom";

export function Producers() {
    const history = useHistory();

    const { hqCode, bccCode, societyCode } = useParams();
    const [producers, setProducers] = useState([]);

    const location = useLocation();
    const headquarters = new URLSearchParams(location.search).get('headquarters');
    const bccName = new URLSearchParams(location.search).get('bccName');
    const societyName = new URLSearchParams(location.search).get('societyName');

    useEffect(() => {
        axios.get(`http://localhost:9000/headquarters/${hqCode}/bcc/${bccCode}/societies/${societyCode}/producers`)
            .then(response => {
                console.log(societyName)
                setProducers(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <section className="table-container">

            

            <h1>PRODUCERS</h1>
            <table class="content-table">
                <thead>
                    <tr>
                        <th>pno</th>
                        <th>pnmae</th>
                        <th>fname</th>
                        <th>doj</th>
                        <th>occupation</th>
                        <th>efee</th>
                        <th>shares</th>
                        <th>amount</th>
                        <th>cat</th>
                        <th>nominee</th>
                        <th>relation</th>
                        <th>photo</th>
                        <th>caste</th>
                        <th>sex</th>
                        <th>society</th>
                        <th>dob</th>
                        <th>sub_caste</th>
                        <th>aadhar_number</th>
                        <th>pan_number</th>
                        <th>phone_no</th>
                        <th>sukhibhava_number</th>
                        <th>nominee_aadhar_number</th>
                        <th>nominee_bank_name</th>
                        <th>nominee_branch_name</th>
                        <th>nominee_account_number</th>
                        <th>nominee_ifsc_code</th>
                        <th>upload_status</th>
                        <th>encrypt_status</th>
                        <th>bcc_code</th>
                        <th>bank_name</th>
                        <th>account_no</th>
                        <th>ifsc_code</th>
                        <th>society_code</th>
                        <th>age</th>
                        <th>upload_date</th>
                        <th>upload_time</th>
                        <th>alternative_no</th>
                        <th>nominee_phone_no</th>
                        <th>copy_status</th>
                        <th>fn</th>
                        <th>status</th>
                    </tr>
                </thead>
                <tbody>
                    {producers.map(producer => (
                        <tr key={producer.pno} onClick={() => history.push(`/headquarters/${hqCode}/bcc/${producer.bcc_code}/societies/${producer.society_code}/producers/${producer.pno}/fn-consolidated-producer?headquarters=${headquarters}&bccName=${bccName}&societyName=${societyName}`)}>
                            <td>{producer.pno}</td>
                            <td>{producer.pname}</td>
                            <td>{producer.fname}</td>
                            <td>{producer.doj}</td>
                            <td>{producer.occupation}</td>
                            <td>{producer.efee}</td>
                            <td>{producer.shares}</td>
                            <td>{producer.amount}</td>
                            <td>{producer.cat}</td>
                            <td>{producer.nominee}</td>
                            <td>{producer.relation}</td>
                            <td>{producer.photo}</td>
                            <td>{producer.caste}</td>
                            <td>{producer.sex}</td>
                            <td>{producer.society}</td>
                            <td>{producer.dob}</td>
                            <td>{producer.sub_caste}</td>
                            <td>{producer.aadhar_number}</td>
                            <td>{producer.pan_number}</td>
                            <td>{producer.phone_no}</td>
                            <td>{producer.sukhibhava_number}</td>
                            <td>{producer.nominee_aadhar_number}</td>
                            <td>{producer.nominee_bank_name}</td>
                            <td>{producer.nominee_branch_name}</td>
                            <td>{producer.nominee_account_number}</td>
                            <td>{producer.nominee_ifsc_code}</td>
                            <td>{producer.upload_status}</td>
                            <td>{producer.encrypt_status}</td>
                            <td>{producer.bcc_code}</td>
                            <td>{producer.bank_name}</td>
                            <td>{producer.account_no}</td>
                            <td>{producer.ifsc_code}</td>
                            <td>{producer.society_code}</td>
                            <td>{producer.age}</td>
                            <td>{producer.upload_date}</td>
                            <td>{producer.upload_time}</td>
                            <td>{producer.alternative_no}</td>
                            <td>{producer.nominee_phone_no}</td>
                            <td>{producer.copy_status}</td>
                            <td>{producer.fn}</td>
                            <td>{producer.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
