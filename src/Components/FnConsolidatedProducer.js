import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
// import { useHistory } from "react-router-dom";

export function FnConsolidatedProducer() {
    // const history = useHistory();

    const { hqCode, bccCode, societyCode, pno } = useParams();

    const location = useLocation();
    const headquarters = new URLSearchParams(location.search).get('headquarters');
    const bccName = new URLSearchParams(location.search).get('bccName');
    const societyName = new URLSearchParams(location.search).get('societyName');

    const [producer, setProducer] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:9000/headquarters/${hqCode}/bcc/${bccCode}/societies/${societyCode}/producers/${pno}`)
            .then(response => {
                setProducer(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [cattles, setCattles] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:9000/headquarters/${hqCode}/bcc/${bccCode}/societies/${societyCode}/producers/${pno}/cattle-information`)
            .then(response => {
                setCattles(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [milkReceiptsFnConsolidated, setMilkReceiptsFnConsolidated] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:9000/headquarters/${hqCode}/bcc/${bccCode}/societies/${societyCode}/producers/${pno}/milk-receipts-fn-consolidated`)
            .then(response => {
                setMilkReceiptsFnConsolidated(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);


    const [recoveries, setRecoveries] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:9000/headquarters/${hqCode}/bcc/${bccCode}/societies/${societyCode}/producers/${pno}/recoveries-entry-fn`)
            .then(response => {
                setRecoveries(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [society, setSociety] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:9000/headquarters/${hqCode}/bcc/${bccCode}/societies/${societyCode}`)
            .then(response => {
                setSociety(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [fromDate, setFromDate] = useState("")
    function handleSetFromDate(event) {
        setFromDate(event.target.value);
        console.log(fromDate)
    }

    const [toDate, setToDate] = useState("")
    function handleSetToDate(event) {
        setToDate(event.target.value);
        console.log(toDate)
    }

    function dateFormatConverter(input) {
        let dateParts = input.split("-");
        let outputDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        return outputDate
    }

    const [milkMain, setMilkMain] = useState([])

    useEffect(() => {
        if (fromDate && toDate) {
            axios.get(`http://localhost:9000/headquarters/${hqCode}/bcc/${bccCode}/societies/${societyCode}/producers/${pno}/milk-receipts-fn-consolidated/${fromDate.slice(0, 10)}/${toDate.slice(0, 10)}`)
                .then(response => {

                    //////////////////
                    console.log("before: ", response.data)

                    let map = new Map();

                    (response.data).forEach(obj => {
                        const key = `${obj.from_date}-${obj.to_date}-${obj.milk_type}`;
                        if (!map.has(key)) {
                            // If date range is not in map, add it with initial values
                            map.set(key, {
                                bcc_code: obj.bcc_code,
                                society_code: obj.society_code,
                                producer_no: obj.producer_no,
                                producer_name: obj.producer_name,
                                milk_session: [obj.milk_session],
                                milk_type: obj.milk_type,
                                ltrs: [obj.ltrs],
                                fat: [obj.fat],
                                snf: [obj.snf],
                                rate: [obj.rate],
                                amount: [obj.amount],
                                kgs: [obj.kgs],
                                kg_fat: [obj.kg_fat],
                                kg_snf: [obj.kg_snf],
                                society_name: obj.society_name,
                                bcc_code_from: obj.bcc_code_from,
                                supervisor_confirmation: obj.supervisor_confirmation,
                                upload_date: [obj.upload_date],
                                upload_time: [obj.upload_time],
                                from_date: obj.from_date,
                                to_date: obj.to_date
                            });
                        } else {
                            // If date range is already in map, update values
                            const val = map.get(key);
                            val.milk_session.push(obj.milk_session);
                            val.ltrs.push(obj.ltrs);
                            val.fat.push(obj.fat);
                            val.snf.push(obj.snf);
                            val.rate.push(obj.rate);
                            val.amount.push(obj.amount);
                            val.kgs.push(obj.kgs);
                            val.kg_fat.push(obj.kg_fat);
                            val.kg_snf.push(obj.kg_snf);
                            val.upload_date.push(obj.upload_date);
                            val.upload_time.push(obj.upload_time);

                        }
                    });

                    // Convert map values to array of objects
                    const result = Array.from(map.values());

                    // Replace single-item arrays with null values
                    result.forEach(obj => {
                        if (obj.milk_session.length === 1) obj.milk_session.push(null);
                        if (obj.ltrs.length === 1) obj.ltrs.push(null);
                        if (obj.fat.length === 1) obj.fat.push(null);
                        if (obj.snf.length === 1) obj.snf.push(null);
                        if (obj.rate.length === 1) obj.rate.push(null);
                        if (obj.amount.length === 1) obj.amount.push(null);
                        if (obj.kgs.length === 1) obj.kgs.push(null);
                        if (obj.kg_fat.length === 1) obj.kg_fat.push(null);
                        if (obj.kg_snf.length === 1) obj.kg_snf.push(null);
                        if (obj.upload_date.length === 1) obj.upload_date.push(null);
                        if (obj.upload_time.length === 1) obj.upload_time.push(null);
                    });

                    console.log("after: ", result);

                    ///////////////////

                    const result2 = result.reduce((acc, { milk_type, from_date, to_date, ltrs, amount, fat, snf }) => {
                        const index = acc.findIndex((item) => item.from_date === from_date && item.to_date === to_date);
                        if (index === -1) {
                            acc.push({ milk_type: [milk_type], from_date, to_date, ltrs: [ltrs], amount: [amount], fat: [fat], snf: [snf] });
                        } else {
                            acc[index].milk_type.push(milk_type);
                            acc[index].ltrs.push(ltrs.map((val) => val !== null ? val : null));
                            acc[index].fat.push(ltrs.map((val) => val !== null ? val : null));
                            acc[index].snf.push(ltrs.map((val) => val !== null ? val : null));
                            acc[index].amount.push(amount.map((val) => val !== null ? val : null));
                        }
                        return acc;
                    }, []);



                    console.log("result2: ", result2);

                    ///////////////////
                    setMilkMain(result2);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [fromDate, toDate]);



    const totalAmount = recoveries.reduce((acc, recovery) => acc + recovery.amount, 0);



    const [openStates, setOpenStates] = useState(new Array(milkMain.length).fill(false));

    function toggleCollapsible(index) {
        const newOpenStates = [...openStates];
        newOpenStates[index] = !newOpenStates[index];
        setOpenStates(newOpenStates);
    }



    return (
        <section className='frame'>

            <div className='first-3fr'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label for="from_date"><b>From Date: &nbsp;</b></label>
                    <div className='select-dropdown'>
                        <select name="from_date" id="from_date" value={fromDate} onChange={handleSetFromDate}>
                            {milkReceiptsFnConsolidated.map(milkReceiptsFnConsolidated => (
                                <option value={milkReceiptsFnConsolidated.from_date}>{String(milkReceiptsFnConsolidated.from_date).slice(0, 10)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label for="to_date"><b>To Date: &nbsp;</b></label>
                    <div className='select-dropdown'>
                        <select name="to_date" id="to_date" value={toDate} onChange={handleSetToDate}>
                            {milkReceiptsFnConsolidated.map(milkReceiptsFnConsolidated => (
                                <option value={milkReceiptsFnConsolidated.to_date}>{String(milkReceiptsFnConsolidated.to_date).slice(0, 10)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* <button onClick={temp}>Get </button> */}
            </div>
            <br />
            <br />
            <br />

            <>
                {milkMain.map((milkMain, index) => (
                    <div key={index} className="collapsible">
                        <div className="collapsible-button" onClick={() => toggleCollapsible(index)} style={{ display: 'flex', justifyContent: 'space-between' }}>

                            <span>&nbsp; From {dateFormatConverter(milkMain.from_date.slice(0, 10))} To {dateFormatConverter(milkMain.to_date.slice(0, 10))}</span>
                            {/* <span>{"+"}</span> */}
                            {/* <span>{openStates[index] && (<span>-&nbsp;&nbsp;&nbsp;&nbsp;</span>)}</span> */}
                            <span>{openStates[index] ? "\u25b2" : "\u25bc"} &nbsp;&nbsp;&nbsp;</span>
                        </div>
                        {openStates[index] && (
                            <div className="collapsible-content">

                                <div className='inner-frame'>
                                    <div className='first-3fr'>
                                        <div style={{ gridColumn: 'span 2' }}><span>VISAKHA DAIRY <b>{headquarters}</b> HQ <b>{societyName}</b> Collection Center</span></div>
                                        <div style={{ gridColumnStart: '3' }}><span>BCC Name : <b>{bccName}</b></span></div>
                                    </div>
                                    <div className='first-3fr'>
                                        <div style={{ gridColumn: 'span 2' }}><span>Producer Vise Milk Collection For The Dates From <b>{dateFormatConverter(milkMain.from_date.slice(0, 10))}</b> To <b>{dateFormatConverter(milkMain.to_date.slice(0, 10))}</b></span></div>
                                        {producer.map(producer => (
                                            <div style={{ gridColumnStart: '3' }}><span>Center Code: {producer.society_code}</span></div>
                                        ))}

                                    </div>
                                    <div className='first-3fr'>

                                        {producer.map(producer => (
                                            <div><span>GL / Producer Number: <b>{producer.pno}</b></span></div>
                                        ))}
                                        {producer.map(producer => (
                                            <div><span>Producer Name: <b>{(producer.pname).split(".").join("")}</b></span></div>
                                        ))}

                                    </div>
                                    <hr />

                                    <div className='first-5fr'>
                                        <div>
                                            <div><span>Father Name</span></div>
                                            <hr />
                                            {producer.map(producer => (
                                                <div > <span><b>{producer.fname}</b></span> </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div><span>Caste</span></div>
                                            <hr />
                                            {producer.map(producer => (
                                                <div> <span><b>{producer.caste}</b></span> </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div><span>Phone No</span></div>
                                            <hr />
                                            {producer.map(producer => (
                                                <div> <span><b>{producer.phone_no}</b></span> </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div><span>Bank Name</span></div>
                                            <hr />
                                            {producer.map(producer => (
                                                <div> <span><b>{producer.bank_name}</b></span> </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div><span>Account Number</span></div>
                                            <hr />
                                            {producer.map(producer => (
                                                <div> <span><b>{producer.account_no}</b></span> </div>
                                            ))}
                                        </div>
                                    </div>
                                    <hr />
                                    <br />
                                    <br />


                                    <div className='first-3fr' ><span><b>Cattles Info</b></span></div>
                                    <hr />

                                    <div className='first-5fr' style={{ justifyItems: 'center' }}>
                                        <div></div>
                                        <div><span>Cattle Type</span></div>
                                        <div><span>Breed</span></div>
                                        <div><span>Tag No</span></div>
                                        <div><span>Insurance No</span></div>
                                    </div>
                                    <hr />

                                    {cattles.map(cattle => (
                                        <>
                                            <div className='first-5fr' style={{ justifyItems: 'center' }}>
                                                <div><span>{cattle.record_status}</span></div>
                                                <div><span>{cattle.milk_type}</span></div>
                                                <div><span>{cattle.breed}</span></div>
                                                <div><span>{cattle.tag_no}</span></div>
                                                <div><span>{cattle.insurance_no}</span></div>
                                            </div>
                                            <hr />
                                        </>
                                    ))}
                                    <br />
                                    <br />

                                    <>
                                        <div><b>Milk Collection</b></div>
                                        <hr />
                                        <div className='first-7fr' style={{ justifyItems: 'center' }}>
                                            <div></div>
                                            <div></div>
                                            <div><span>Liters</span></div>
                                            <div><span>FAT</span></div>
                                            <div><span>SNF</span></div>
                                            <div><span>Avg</span> Rate</div>
                                            <div><span>Amount</span></div>
                                        </div>
                                        <hr />


                                        <div className='first-7fr' style={{ justifyItems: 'center' }}>
                                            <div><span>B</span></div>
                                            <div><span>AM</span></div>
                                            <div><span>{milkMain.ltrs.length < 2 ? (milkMain.milk_type[0] === 'B' ? milkMain.ltrs[0][0] : null) : milkMain.ltrs[0][0]}</span></div>
                                            <div><span>{milkMain.fat.length < 2 ? (milkMain.milk_type[0] === 'B' ? milkMain.fat[0][0] : null) : milkMain.fat[0][0]}</span></div>
                                            <div><span>{milkMain.snf.length < 2 ? (milkMain.milk_type[0] === 'B' ? milkMain.snf[0][0] : null) : milkMain.snf[0][0]}</span></div>
                                            <div><span>{milkMain.amount.length < 2 ? (milkMain.milk_type[0] === 'B' ? +(milkMain.amount[0][0] / milkMain.ltrs[0][0]).toFixed(2) : null) : +(milkMain.amount[0][0] / milkMain.ltrs[0][0]).toFixed(2)}</span></div>
                                            <div><span>{milkMain.amount.length < 2 ? (milkMain.milk_type[0] === 'B' ? milkMain.amount[0][0] : null) : milkMain.amount[0][0]}</span></div>
                                        </div>
                                        {/* <hr /> */}

                                        <div className='first-7fr' style={{ justifyItems: 'center' }}>
                                            <div></div>
                                            <div><span>PM</span></div>
                                            <div><span>{milkMain.ltrs.length < 2 ? (milkMain.milk_type[0] === 'B' ? milkMain.ltrs[0][1] : null) : milkMain.ltrs[0][1]}</span></div>
                                            <div><span>{milkMain.fat.length < 2 ? (milkMain.milk_type[0] === 'B' ? milkMain.fat[0][1] : null) : milkMain.fat[0][1]}</span></div>
                                            <div><span>{milkMain.snf.length < 2 ? (milkMain.milk_type[0] === 'B' ? milkMain.snf[0][1] : null) : milkMain.snf[0][1]}</span></div>
                                            <div><span>{milkMain.amount.length < 2 ? (milkMain.milk_type[0] === 'B' ? +(milkMain.amount[0][1] / milkMain.ltrs[0][1]).toFixed(2) : null) : +(milkMain.amount[0][1] / milkMain.ltrs[0][1]).toFixed(2)}</span></div>
                                            <div><span>{milkMain.amount.length < 2 ? (milkMain.milk_type[0] === 'B' ? milkMain.amount[0][1] : null) : milkMain.amount[0][1]}</span></div>
                                        </div>

                                        <hr />

                                        <div className='first-7fr' style={{ justifyItems: 'center' }}>
                                            <div></div>
                                            <div><span>Total</span></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div><span><b>{milkMain.amount[0][0] + milkMain.amount[0][1]}</b></span></div>
                                        </div>
                                        <hr />



                                        <div className='first-7fr' style={{ justifyItems: 'center' }}>
                                            <div>C</div>
                                            <div>AM</div>
                                            <div><span>{milkMain.ltrs.length < 2 ? (milkMain.milk_type[0] === 'C' ? milkMain.ltrs[0] : null) : milkMain.ltrs[1][0]}</span></div>
                                            <div><span>{milkMain.fat.length < 2 ? (milkMain.milk_type[0] === 'C' ? milkMain.fat[0] : null) : milkMain.fat[1][0]}</span></div>
                                            <div><span>{milkMain.snf.length < 2 ? (milkMain.milk_type[0] === 'C' ? milkMain.snf[0] : null) : milkMain.snf[1][0]}</span></div>
                                            <div><span>{milkMain.amount.length < 2 ? (milkMain.milk_type[0] === 'C' ? +(milkMain.amount[0] / milkMain.ltrs[0]).toFixed(2) : null) : +(milkMain.amount[1][0] / milkMain.ltrs[1][0]).toFixed(2)}</span></div>
                                            <div><span>{milkMain.amount.length < 2 ? (milkMain.milk_type[0] === 'C' ? milkMain.amount[0] : null) : milkMain.amount[1][0]}</span></div>
                                        </div>


                                        <div className='first-7fr' style={{ justifyItems: 'center' }}>
                                            <div></div>
                                            <div>PM</div>
                                            <div><span>{milkMain.ltrs.length < 2 ? (milkMain.milk_type[1] === 'C' ? milkMain.ltrs[1] : null) : milkMain.ltrs[1][1]}</span></div>
                                            <div><span>{milkMain.fat.length < 2 ? (milkMain.milk_type[1] === 'C' ? milkMain.fat[1] : null) : milkMain.fat[1][1]}</span></div>
                                            <div><span>{milkMain.snf.length < 2 ? (milkMain.milk_type[1] === 'C' ? milkMain.snf[1] : null) : milkMain.snf[1][1]}</span></div>
                                            <div><span>{milkMain.amount.length < 2 ? (milkMain.milk_type[1] === 'C' ? +(milkMain.amount[1] / milkMain.ltrs[1]).toFixed(2) : null) : +(milkMain.amount[1][1] / milkMain.ltrs[1][1]).toFixed(2)}</span></div>
                                            <div><span>{milkMain.amount.length < 2 ? (milkMain.milk_type[1] === 'C' ? milkMain.amount[1] : null) : milkMain.amount[1][1]}</span></div>
                                        </div>
                                        <hr />

                                        <div className='first-7fr' style={{ justifyItems: 'center' }}>
                                            <div></div>
                                            <div>Total</div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div><span><b>{milkMain.amount.length < 2 ? (milkMain.milk_type[1] === 'C' ? milkMain.amount[0] + milkMain.amount[1] : null) : milkMain.amount[1][0] + milkMain.amount[1][1]}</b></span></div>
                                        </div>
                                        <hr />

                                        <div className='first-7fr' style={{ justifyItems: 'center' }}>
                                            <div><b>Total</b></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div><span><b>{milkMain.amount.length < 2 ? milkMain.amount[0][0] + milkMain.amount[0][1] : milkMain.amount[0][0] + milkMain.amount[0][1] + milkMain.amount[1][0] + milkMain.amount[1][1]}</b></span></div>
                                        </div>
                                        <hr />

                                        <br />
                                        <br />



                                    </>
                                    <>
                                        <div className='first-7fr'  >
                                            <div><span><b>Recoveries</b></span></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div style={{ textAlign: 'end' }}><span>Total</span></div>
                                        </div>
                                        <hr />

                                        <div className='first-3fr' >
                                            <div>{dateFormatConverter(toDate.slice(0, 10))}</div>

                                            <div>
                                                {recoveries.map(recovery => (
                                                    <div><span>{recovery.recovery_name}</span> <hr /></div>
                                                ))}
                                            </div>
                                            <div>
                                                {recoveries.map(recovery => (
                                                    <div style={{ textAlign: 'end' }}><span><b>{recovery.amount}</b></span> <hr /></div>
                                                ))}
                                            </div>

                                        </div>

                                        <div className='first-3fr'>
                                            <div><span><b>Total</b></span></div>
                                            <div></div>
                                            <div style={{ textAlign: 'end' }}><b>{totalAmount}</b></div>
                                        </div>


                                    </>

                                </div>

                            </div>
                        )}
                    </div>
                ))}
            </>







        </section>
    );
}
