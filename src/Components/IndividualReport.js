import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link, useLocation } from "react-router-dom";
import { FnConsolidatedProducer } from './FnConsolidatedProducer';
import { Duplicate } from './Duplicate';


export function IndividualReport(props) {
    const location = useLocation();
    const selectedBcc = location.state.selectedBcc;
    const selectedSocietyX = location.state.selectedSocietyX;
    const fromDatePassed = location.state.fromDate
    const toDatePassed = location.state.toDate


    const [producersWithinDates, setProducersWithinDates] = useState([]);

    useEffect(() => {
        console.log("fromDatePassed: ", fromDatePassed)
        console.log("toDatePassed: ", toDatePassed)
        axios.get(`http://localhost:9000/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${fromDatePassed.slice(0, 10)}/${toDatePassed.slice(0, 10)}`)
            .then(response => {
                console.log("producersWithinDates: ", response.data)
                setProducersWithinDates(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [producers, setProducers] = useState([]);

    useEffect(() => {
        if (producersWithinDates.length > 0) {
            axios.get(`http://localhost:9000/headquarters/${selectedBcc.hq_code}/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers`)
                .then(response => {
                    console.log("producersWithinDates: ", producersWithinDates)
                    console.log("response.data: ", response.data)
                    let result = response.data.filter(obj1 => producersWithinDates.some(obj2 => obj1.pno === obj2.producer_no));
                    console.log("producer result: ", result)
                    setProducers(result);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        else {
            setProducers([]);
        }
    }, [producersWithinDates]);

    const [producer, setProducer] = useState(null);

    const [selectedProducer, setSelectedProducer] = useState(null);
    useEffect(() => {
        if (producer) {
            setSelectedProducer(producer)
        } else {
            setSelectedProducer(null);
        }
    }, [producer]);


    const handleProducerChange = (event) => {
        // setProducer(true)
        const selectedPno = event.target.value;
        setSelectedProducer(producers.find((producer) => producer.pno == selectedPno));
    };


    const [milkReceiptsFnConsolidated, setMilkReceiptsFnConsolidated] = useState([]);

    useEffect(() => {
        if (selectedProducer) {
            console.log("--------------------- ", selectedProducer, typeof (selectedProducer))
            axios.get(`http://localhost:9000/headquarters/${selectedBcc.hq_code}/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${selectedProducer.pno}/milk-receipts-fn-consolidated`)
                .then(response => {
                    console.log("milkReceiptsFnConsolidated  ", response.data)
                    setMilkReceiptsFnConsolidated(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setMilkReceiptsFnConsolidated([]);
        }

    }, [selectedProducer]);


    const [fromDate, setFromDate] = useState(fromDatePassed)
    function handleSetFromDate(event) {
        setFromDate(event.target.value);
        console.log(fromDate)
    }

    const [toDate, setToDate] = useState(toDatePassed)
    function handleSetToDate(event) {
        setToDate(event.target.value);
        console.log(toDate)
    }

    const [milkReceiptsFnConsolidatedFnwise, setMilkReceiptsFnConsolidatedFnwise] = useState([]);

    useEffect(() => {
        if (selectedProducer && fromDate && toDate) {
            axios.get(`http://localhost:9000/headquarters/${selectedBcc.hq_code}/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${selectedProducer.pno}/milk-receipts-fn-consolidated/${fromDate.slice(0, 10)}/${toDate.slice(0, 10)}`)
                .then(response => {
                    console.log("milkReceiptsFnConsolidatedFnwise  ", response.data)
                    setMilkReceiptsFnConsolidatedFnwise(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setMilkReceiptsFnConsolidatedFnwise([]);
        }

    }, [selectedProducer, fromDate, toDate]);



    const [recoveries, setRecoveries] = useState([]);

    useEffect(() => {
        if (selectedProducer && fromDate && toDate) {
            console.log("dates: ", fromDate, toDate)
            axios.get(`http://localhost:9000/headquarters/${selectedBcc.hq_code}/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${selectedProducer.pno}/recoveries-entry-fn/${fromDate.slice(0, 10)}/${toDate.slice(0, 10)}`)
                .then(response => {
                    setRecoveries(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setRecoveries([]);
        }
    }, [selectedProducer, fromDate, toDate]);


    const [recovery, setRecovery] = useState([]);

    useEffect(() => {
        if (fromDate && toDate && selectedProducer) {
            console.log("dates: ", fromDate, toDate)
            axios.get(`http://localhost:9000/headquarters/${selectedBcc.hq_code}/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${selectedProducer.pno}/recoveries-entry-fn/${fromDate.slice(0, 10)}/${toDate.slice(0, 10)}`)
                .then(response => {
                    console.log("recoveries: ", response.data)
                    setRecovery(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setRecovery([]);
        }
    }, [fromDate, toDate, selectedProducer]);

    const [recoveryFnWise, setRecoveryFnWise] = useState([]);

    useEffect(() => {
        if (fromDate && toDate && selectedProducer) {
            console.log("dates: ", fromDate, toDate)
            axios.get(`http://localhost:9000/headquarters/${selectedBcc.hq_code}/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${selectedProducer.pno}/recoveries-entry-fn/${fromDate.slice(0, 10)}/${toDate.slice(0, 10)}`)
                .then(response => {
                    const groupedData = response.data.reduce((acc, obj) => {
                        const existingObj = acc.find(
                            item => item.from_date === obj.from_date && item.to_date === obj.to_date
                        );

                        if (existingObj) {
                            existingObj.recovery_name.push(obj.recovery_name);
                            existingObj.amount.push(obj.amount);
                            existingObj.record_no.push(obj.record_no);
                            // existingObj.record_no.push(obj.from_date);
                            // existingObj.record_no.push(obj.to_date);
                        } else {
                            const newObj = { ...obj, recovery_name: [obj.recovery_name], amount: [obj.amount], record_no: [obj.record_no] };
                            acc.push(newObj);
                        }

                        return acc;
                    }, []);

                    console.log("groupedData: ", groupedData);
                    setRecoveryFnWise(groupedData)
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setRecoveryFnWise([]);
        }
    }, [fromDate, toDate, selectedProducer]);



    const [cattles, setCattles] = useState([]);

    useEffect(() => {
        if (selectedProducer) {
            axios.get(`http://localhost:9000/headquarters/${selectedBcc.hq_code}/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${selectedProducer.pno}/cattle-information`)
                .then(response => {
                    setCattles(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setCattles([]);
        }
    }, [selectedProducer]);


    const [milkMain, setMilkMain] = useState([])
    let fromDatesArray = []
    let toDatesArray = []

    useEffect(() => {
        if (selectedProducer && fromDate && toDate) {
            axios.get(`http://localhost:9000/headquarters/${selectedBcc.hq_code}/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${selectedProducer.pno}/milk-receipts-fn-consolidated/${fromDate.slice(0, 10)}/${toDate.slice(0, 10)}`)
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

                        if (obj.ltrs.length === 1) {
                            if (obj.milk_session[0] == 'PM') {
                                obj.ltrs.unshift(null)
                            }
                            else if (obj.milk_session[0] == 'AM') {
                                obj.ltrs.push(null);
                            }
                        }
                        if (obj.fat.length === 1) {
                            if (obj.milk_session[0] == 'PM') {
                                obj.fat.unshift(null)
                            }
                            else if (obj.milk_session[0] == 'AM') {
                                obj.fat.push(null);
                            }
                        }
                        if (obj.snf.length === 1) {
                            if (obj.milk_session[0] == 'PM') {
                                obj.snf.unshift(null)
                            }
                            else if (obj.milk_session[0] == 'AM') {
                                obj.snf.push(null);
                            }
                        }
                        if (obj.rate.length === 1) {
                            if (obj.milk_session[0] == 'PM') {
                                obj.rate.unshift(null)
                            }
                            else if (obj.milk_session[0] == 'AM') {
                                obj.rate.push(null);
                            }
                        }
                        if (obj.amount.length === 1) {
                            if (obj.milk_session[0] == 'PM') {
                                obj.amount.unshift(null)
                            }
                            else if (obj.milk_session[0] == 'AM') {
                                obj.amount.push(null);
                            }
                        }
                        if (obj.kgs.length === 1) obj.kgs.push(null);
                        if (obj.kg_fat.length === 1) obj.kg_fat.push(null);
                        if (obj.kg_snf.length === 1) obj.kg_snf.push(null);
                        if (obj.upload_date.length === 1) obj.upload_date.push(null);
                        if (obj.upload_time.length === 1) obj.upload_time.push(null);
                        if (obj.milk_session.length === 1) {
                            if (obj.milk_session[0] == 'PM') {
                                obj.milk_session.unshift(null)
                            }
                            else if (obj.milk_session[0] == 'AM') {
                                obj.milk_session.push(null);
                            }
                        }
                    });

                    console.log("after: ", result);

                    ///////////////////

                    const result2 = result.reduce((acc, { milk_type, from_date, to_date, ltrs, amount, fat, snf, milk_session }) => {
                        const index = acc.findIndex((item) => item.from_date === from_date && item.to_date === to_date);
                        if (index === -1) {
                            acc.push({ milk_type: [milk_type], from_date, to_date, ltrs: [ltrs], amount: [amount], fat: [fat], snf: [snf], milk_session: [milk_session] });
                        } else {
                            acc[index].milk_type.push(milk_type);
                            acc[index].ltrs.push(ltrs.map((val) => val !== null ? val : null));
                            acc[index].fat.push(ltrs.map((val) => val !== null ? val : null));
                            acc[index].snf.push(ltrs.map((val) => val !== null ? val : null));
                            acc[index].amount.push(amount.map((val) => val !== null ? val : null));
                            acc[index].milk_session.push(milk_session.map((val) => val !== null ? val : null));
                        }
                        return acc;
                    }, []);


                    fromDatesArray = result2.map(obj => obj.from_date);
                    toDatesArray = result2.map(obj => obj.to_date);

                    console.log(fromDatesArray);
                    console.log(toDatesArray);



                    ///////////////////
                    console.log("milkMain: ", result2)
                    setMilkMain(result2);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [fromDate, toDate, selectedProducer]);





    const handleClicker = (index) => {
        const newWindow = window.open("", "", "width=1100,height=700");
        const divContent = document.getElementById(`myDiv${index}`).innerHTML;
        newWindow.document.write(divContent);

        const styleElement = newWindow.document.createElement("style");
        styleElement.innerHTML = `
        /*! CSS Used from: Embedded */
::-webkit-scrollbar{width:7px;}
::-webkit-scrollbar-track{background:#f1f1f1;}
::-webkit-scrollbar-thumb{background:#008bdb;border-radius:10px;}
::-webkit-scrollbar-thumb:hover{background:#016faf;}
.myDivx{border:1px solid black;margin:auto;margin-top:2rem;}
.border-purpose{border:2px solid black;margin:1rem;}
.inner-frame{margin:1rem 2rem;}
.first-3fr{align-items:center;padding:8px 0;display:grid;grid-template-columns:1fr 1fr 1fr;}
.first-5fr{align-items:center;padding:8px 0;display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;}
.first-7fr{align-items:center;padding:8px 0;display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr 1fr;}
/*! CSS Used from: Embedded */
*{margin:0px;padding:0px;box-sizing:border-box;font-family: Poppins-Regular, sans-serif;}
        `;
        newWindow.document.head.appendChild(styleElement);
    };

    const handleClickerPeriodic = () => {
        const newWindow = window.open("/individual-report", "My window", "width=1100,height=700");
        const divContent = document.getElementById('myDivx').innerHTML;
        newWindow.document.write(divContent);

        const styleElement = newWindow.document.createElement("style");
        styleElement.innerHTML = `
        /*! CSS Used from: Embedded */
::-webkit-scrollbar{width:7px;}
::-webkit-scrollbar-track{background:#f1f1f1;}
::-webkit-scrollbar-thumb{background:#008bdb;border-radius:10px;}
::-webkit-scrollbar-thumb:hover{background:#016faf;}
#myDivx{border:2px solid black;margin:auto;margin-top:2rem;}
.border-purpose{border:2px solid black;margin:1rem;}
.inner-frame{margin:1rem 2rem;}
.first-3fr{align-items:center;padding:8px 0;display:grid;grid-template-columns:1fr 1fr 1fr;}
.first-5fr{align-items:center;padding:8px 0;display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;}
.main-grid{display:grid;width:95%;margin:auto;}
.inner-grid{display:grid;grid-template-columns:repeat(4, 1fr);grid-gap:5px;padding:5px;}
.inner-grid5{display:grid;grid-template-columns:repeat(5, 1fr);grid-gap:5px;padding:5px;}
.inner-item{background-color:#e1e1e1;font-size:14px;text-align:center;}
.sub-inner-grid{display:grid;grid-template-columns:repeat(3, 1fr);}
.sub-inner-grid2{display:grid;grid-template-columns:repeat(2, 1fr);}
.sub-inner-grid1{display:grid;grid-template-columns:repeat(1, 1fr);}
.sub-inner-item{background-color:#ececec;padding:5px;}
.sub-sub-inner-grid{display:grid;grid-template-columns:repeat(3, 1fr);}
.sub-sub-inner-item{background-color:#fff;padding:5px;display:flex;flex-direction:column;}
/*! CSS Used from: Embedded */
*{margin:0px;padding:0px;box-sizing:border-box;font-family: Poppins-Regular, sans-serif;}
        `
        newWindow.document.head.appendChild(styleElement);
    };

    const handleClickerDaywise = () => {
        const newWindow = window.open("", "", "width=900,height=700");
        const divContent = document.getElementById('myDivDay').innerHTML;
        newWindow.document.write(divContent);

        const styleElement = newWindow.document.createElement("style");
        styleElement.innerHTML = `
        .inner-frame {
            margin: 1rem 2rem;
            width: 900px;
          }
        .main-grid {
            display: grid;
          }
          
          .inner-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-gap: 5px;
            padding: 5px;
          }
          
          .inner-item {
            background-color: #333;
            color: #fff;
            font-size: 14px;
            text-align: center;
          }
          
          .sub-inner-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }
          .sub-inner-grid2 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }
          .sub-inner-grid1 {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
          }
          
          .sub-inner-item {
            background-color: #555;
            color: #fff;
            padding: 5px;
          }
          
          .sub-sub-inner-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }
          
          
          .sub-sub-inner-item {
            background-color: #777;
            color: #fff;
            padding: 5px;
            display: flex;
            flex-direction: column;
          }

          .day-inner-grid{
            display: grid;
            grid-template-columns: 1fr 4fr 2fr;
            grid-gap: 5px;
            padding: 5px;
          }
          
          .day-sub-sub-inner-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
          }
        `;
        newWindow.document.head.appendChild(styleElement);
    };


    const [openStates, setOpenStates] = useState(new Array(milkMain.length).fill(false));

    function toggleCollapsible(index) {
        const newOpenStates = [...openStates];
        newOpenStates[index] = !newOpenStates[index];
        setOpenStates(newOpenStates);
    }




    const DayWiseB = ({ from, to }) => {
        const [dayWiseDataBAm, setDayWiseDataBAm] = useState([]);
        const [dayWiseDataBPm, setDayWiseDataBPm] = useState([]);

        useEffect(() => {
            if (selectedProducer) {
                axios.get(`http://localhost:9000/milk-receipts/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${selectedProducer.pno}/${from.slice(0, 10)}/${to.slice(0, 10)}/B/AM`)
                    .then(response => {
                        console.log("milk-receiptsBAm: ", response.data);
                        setDayWiseDataBAm(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }, [from, to, selectedProducer]);
        useEffect(() => {
            if (selectedProducer) {
                axios.get(`http://localhost:9000/milk-receipts/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${selectedProducer.pno}/${from.slice(0, 10)}/${to.slice(0, 10)}/B/PM`)
                    .then(response => {
                        console.log("milk-receiptsBPm: ", response.data);
                        setDayWiseDataBPm(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }, [from, to, selectedProducer]);


        const [isReady, setIsReady] = useState(false);

        useEffect(() => {
            if (dayWiseDataBPm.length > 0 && dayWiseDataBAm.length > 0 && dayWiseDataBAm.length < dayWiseDataBPm.length) {

                let extraDates = (dayWiseDataBPm.map((record) => record.session_date));
                console.log(extraDates)
                extraDates = extraDates.filter((item, index) => extraDates.indexOf(item) !== index);
                console.log("extraDates ", extraDates)

                let dummyData = []
                let j = 0
                for (let i = 0; i < dayWiseDataBAm.length; i++) {
                    if (dayWiseDataBAm[i].session_date == extraDates[j]) {
                        let dummyObj = {
                            "bcc_code": 15,
                            "society_code": 185,
                            "producer_no": 22,
                            "producer_name": "LALAM LAKSHMI",
                            "receipt_date": "-",
                            "milk_session": "AM",
                            "milk_type": "B",
                            "ltrs": "-",
                            "fat": "-",
                            "lr": "-",
                            "snf": "-",
                            "rate": "-",
                            "amount": "-",
                            "record_no": "-",
                            "receipt_type": "-",
                            "kgs": "-",
                            "kg_fat": "-",
                            "kg_snf": "-",
                            "society_name": "R.NARASAPURAM",
                            "s_no": "-",
                            "record_status": "Active",
                            "session_date": extraDates[j],
                        }
                        dummyData.push(dummyObj)

                        j++;

                    }
                }
                setDayWiseDataBAm([...dayWiseDataBAm, ...dummyData].sort((a, b) => a.session_date.localeCompare(b.session_date)))
                setIsReady(true);
            }
            else if (dayWiseDataBPm.length > 0 && dayWiseDataBAm.length > 0 && dayWiseDataBAm.length > dayWiseDataBPm.length) {

                let extraDates = (dayWiseDataBAm.map((record) => record.session_date));
                console.log(extraDates)
                extraDates = extraDates.filter((item, index) => extraDates.indexOf(item) !== index);
                console.log("extraDates ", extraDates)

                let dummyData = []
                let j = 0
                for (let i = 0; i < dayWiseDataBPm.length; i++) {
                    if (dayWiseDataBPm[i].session_date == extraDates[j]) {
                        let dummyObj = {
                            "bcc_code": 15,
                            "society_code": 185,
                            "producer_no": 22,
                            "producer_name": "LALAM LAKSHMI",
                            "receipt_date": "-",
                            "milk_session": "PM",
                            "milk_type": "B",
                            "ltrs": "-",
                            "fat": "-",
                            "lr": "-",
                            "snf": "-",
                            "rate": "-",
                            "amount": "-",
                            "record_no": "-",
                            "receipt_type": "-",
                            "kgs": "-",
                            "kg_fat": "-",
                            "kg_snf": "-",
                            "society_name": "R.NARASAPURAM",
                            "s_no": "-",
                            "record_status": "Active",
                            "session_date": extraDates[j],
                        }
                        dummyData.push(dummyObj)

                        j++;

                    }
                }
                setDayWiseDataBPm([...dayWiseDataBPm, ...dummyData].sort((a, b) => a.session_date.localeCompare(b.session_date)))
                setIsReady(true);

            }
        }, [from, to, selectedProducer, dayWiseDataBPm]);




        return (
            <div className="day-inner-grid">
                <div className="inner-item">
                    <div>Date</div>
                    <div className="">
                        <div className="sub-inner-item">
                            <div>-------</div>
                            <div className="">
                                <div className="sub-sub-inner-item">
                                    <div>----</div>
                                    {isReady ?
                                        <div>
                                            {dayWiseDataBPm.map((day) => (
                                                <div key={day.id}>{day.session_date.slice(0, 10)}</div>
                                            ))}
                                        </div>
                                        : ""

                                    }

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="inner-item">
                    <div>B</div>
                    <div className="sub-inner-grid2">
                        <div className="sub-inner-item">
                            <div>AM</div>
                            {isReady ?
                                <div className="day-sub-sub-inner-grid">
                                    <div className="sub-sub-inner-item">
                                        <div>Liters</div>
                                        {dayWiseDataBAm.map(day => (
                                            <div key={day.id}>{day.ltrs}</div>
                                        ))}
                                    </div>
                                    <div className="sub-sub-inner-item">
                                        <div>FAT</div>
                                        {dayWiseDataBAm.map(day => (
                                            <div key={day.id}>{day.fat}</div>
                                        ))}
                                    </div>
                                    <div className="sub-sub-inner-item">
                                        <div>SNF</div>
                                        {dayWiseDataBAm.map(day => (
                                            <div key={day.id}>{day.snf}</div>
                                        ))}
                                    </div>
                                    <div className="sub-sub-inner-item">
                                        <div>Col Type</div>
                                        {dayWiseDataBAm.map(day => (
                                            <div key={day.id}>{day.receipt_type}</div>
                                        ))}
                                    </div>
                                </div>
                                : ""
                            }
                        </div>
                        <div className="sub-inner-item">
                            <div>PM</div>
                            <div className="day-sub-sub-inner-grid">
                                <div className="sub-sub-inner-item">
                                    <div>Liters</div>
                                    {dayWiseDataBPm.map(day => (
                                        <div key={day.id}>{day.ltrs}</div>
                                    ))}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>FAT</div>
                                    {dayWiseDataBPm.map(day => (
                                        <div key={day.id}>{day.fat}</div>
                                    ))}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>SNF</div>
                                    {dayWiseDataBPm.map(day => (
                                        <div key={day.id}>{day.snf}</div>
                                    ))}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>Col Type</div>
                                    {dayWiseDataBPm.map(day => (
                                        <div key={day.id}>{day.receipt_type}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inner-item">
                    <div>Total</div>
                    <div className="sub-inner-grid1">
                        <div className="sub-inner-item">
                            <div>-------</div>
                            <div className="sub-sub-inner-grid">
                                <div className="sub-sub-inner-item">
                                    <div>Liters</div>
                                    {dayWiseDataBAm.length > 0 ? (
                                        dayWiseDataBAm.reduce((result, dayAm, index) => {
                                            result.push(
                                                // (dayWiseDataBPm.length > 0 && (dayAm.hasOwnProperty('ltrs')))?
                                                //     <div >
                                                //         {String(dayAm.ltrs + dayWiseDataBPm[index].ltrs).slice(0, [(String(dayAm.ltrs + dayWiseDataBPm[index].ltrs)).indexOf(".") + 2]).replace(/-/g, '')}
                                                //     </div>
                                                //     : ""


                                            );
                                            return result;
                                        }, [])
                                    ) : (
                                        <div>--</div>
                                    )}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>FAT</div>
                                    {dayWiseDataBAm.length > 0 ? (
                                        dayWiseDataBAm.reduce((result, dayAm, index) => {
                                            result.push(
                                                // (dayWiseDataBPm.length > 0  && ('fat' in dayAm))?
                                                //     <div key={dayAm.id}>
                                                //         {String(dayAm.fat + dayWiseDataBPm[index].fat).slice(0, [(String(dayAm.fat + dayWiseDataBPm[index].fat)).indexOf(".") + 2]).replace(/-/g, '')}
                                                //     </div>
                                                //     : ""
                                            );
                                            return result;
                                        }, [])
                                    ) : (
                                        <div>--</div>
                                    )}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>SNF</div>
                                    {dayWiseDataBAm.length > 0 ? (
                                        dayWiseDataBAm.reduce((result, dayAm, index) => {
                                            result.push(
                                                // (dayWiseDataBPm.length > 0  && ('snf' in dayAm))?
                                                //     <div key={dayAm.id}>
                                                //         {String(dayAm.snf + dayWiseDataBPm[index].snf).slice(0, [(String(dayAm.snf + dayWiseDataBPm[index].snf)).indexOf(".") + 2]).replace(/-/g, '')}
                                                //     </div>
                                                //     : ""
                                            );
                                            return result;
                                        }, [])
                                    ) : (
                                        <div>--</div>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );
    };


    const DayWiseC = ({ from, to }) => {
        const [dayWiseDataCAm, setDayWiseDataCAm] = useState([]);
        const [dayWiseDataCPm, setDayWiseDataCPm] = useState([]);

        useEffect(() => {
            if (selectedProducer) {
                axios.get(`http://localhost:9000/milk-receipts/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${selectedProducer.pno}/${from.slice(0, 10)}/${to.slice(0, 10)}/C/AM`)
                    .then(response => {
                        console.log("milk-receiptsCAm: ", response.data);
                        setDayWiseDataCAm(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }, [from, to, selectedProducer]);
        useEffect(() => {
            if (selectedProducer) {
                axios.get(`http://localhost:9000/milk-receipts/bcc/${selectedBcc.bcc_code}/societies/${selectedSocietyX.society_code}/producers/${selectedProducer.pno}/${from.slice(0, 10)}/${to.slice(0, 10)}/C/PM`)
                    .then(response => {
                        console.log("milk-receiptsCPm: ", response.data);
                        setDayWiseDataCPm(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }, [from, to, selectedProducer]);



        const [isReady, setIsReady] = useState(false);

        useEffect(() => {
            console.log("----->   ", dayWiseDataCAm.length, dayWiseDataCPm.length)
            if (dayWiseDataCPm.length > 0 && dayWiseDataCAm.length > 0 && dayWiseDataCAm.length < dayWiseDataCPm.length) {

                let extraDates = (dayWiseDataCPm.map((record) => record.session_date));
                console.log(extraDates)
                extraDates = extraDates.filter((item, index) => extraDates.indexOf(item) !== index);
                console.log("extraDates ", extraDates)

                let dummyData = []
                let j = 0
                for (let i = 0; i < dayWiseDataCAm.length; i++) {
                    if (dayWiseDataCAm[i].session_date == extraDates[j]) {
                        let dummyObj = {
                            "bcc_code": 15,
                            "society_code": 185,
                            "producer_no": 22,
                            "producer_name": "LALAM LAKSHMI",
                            "receipt_date": "-",
                            "milk_session": "AM",
                            "milk_type": "C",
                            "ltrs": "-",
                            "fat": "-",
                            "lr": "-",
                            "snf": "-",
                            "rate": "-",
                            "amount": "-",
                            "record_no": "-",
                            "receipt_type": "-",
                            "kgs": "-",
                            "kg_fat": "-",
                            "kg_snf": "-",
                            "society_name": "R.NARASAPURAM",
                            "s_no": "-",
                            "record_status": "Active",
                            "session_date": extraDates[j],
                        }
                        dummyData.push(dummyObj)

                        j++;

                    }
                }
                setDayWiseDataCAm([...dayWiseDataCAm, ...dummyData].sort((a, b) => a.session_date.localeCompare(b.session_date)))
                setIsReady(true);
            }
            else if (dayWiseDataCPm.length > 0 && dayWiseDataCAm.length > 0 && dayWiseDataCAm.length > dayWiseDataCPm.length) {

                let extraDates = (dayWiseDataCAm.map((record) => record.session_date));
                console.log(extraDates)
                extraDates = extraDates.filter((item, index) => extraDates.indexOf(item) !== index);
                console.log("extraDates ", extraDates)

                let dummyData = []
                let j = 0
                for (let i = 0; i < dayWiseDataCPm.length; i++) {
                    if (dayWiseDataCPm[i].session_date == extraDates[j]) {
                        let dummyObj = {
                            "bcc_code": 15,
                            "society_code": 185,
                            "producer_no": 22,
                            "producer_name": "LALAM LAKSHMI",
                            "receipt_date": "-",
                            "milk_session": "PM",
                            "milk_type": "C",
                            "ltrs": "-",
                            "fat": "-",
                            "lr": "-",
                            "snf": "-",
                            "rate": "-",
                            "amount": "-",
                            "record_no": "-",
                            "receipt_type": "-",
                            "kgs": "-",
                            "kg_fat": "-",
                            "kg_snf": "-",
                            "society_name": "R.NARASAPURAM",
                            "s_no": "-",
                            "record_status": "Active",
                            "session_date": extraDates[j],
                        }
                        dummyData.push(dummyObj)

                        j++;

                    }
                }
                setDayWiseDataCPm([...dayWiseDataCPm, ...dummyData].sort((a, b) => a.session_date.localeCompare(b.session_date)))
                setIsReady(true);

            }


        }, [from, to, selectedProducer, dayWiseDataCAm, dayWiseDataCPm]);




        return (
            <div className="day-inner-grid">
                <div className="inner-item">
                    <div>Date</div>
                    <div className="">
                        <div className="sub-inner-item">
                            <div>-------</div>
                            <div className="">
                                <div className="sub-sub-inner-item">
                                    <div>----</div>
                                    {isReady ?
                                        <div>
                                            {dayWiseDataCAm.map((day) => (
                                                <div key={day.id}>{day.session_date.slice(0, 10)}</div>
                                            ))}
                                        </div>
                                        : ""

                                    }

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="inner-item">
                    <div>C</div>
                    <div className="sub-inner-grid2">
                        <div className="sub-inner-item">
                            <div>AM</div>
                            {/* {isReady ? */}
                            <div className="day-sub-sub-inner-grid">
                                <div className="sub-sub-inner-item">
                                    <div>Liters</div>
                                    {dayWiseDataCAm.map(day => (
                                        <div key={day.id}>{day.ltrs}</div>
                                    ))}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>FAT</div>
                                    {dayWiseDataCAm.map(day => (
                                        <div key={day.id}>{day.fat}</div>
                                    ))}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>SNF</div>
                                    {dayWiseDataCAm.map(day => (
                                        <div key={day.id}>{day.snf}</div>
                                    ))}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>Col Type</div>
                                    {dayWiseDataCAm.map(day => (
                                        <div key={day.id}>{day.receipt_type}</div>
                                    ))}
                                </div>
                            </div>
                            : ""
                            {/* } */}
                        </div>
                        <div className="sub-inner-item">
                            <div>PM</div>
                            <div className="day-sub-sub-inner-grid">
                                <div className="sub-sub-inner-item">
                                    <div>Liters</div>
                                    {dayWiseDataCPm.map(day => (
                                        <div key={day.id}>{day.ltrs}</div>
                                    ))}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>FAT</div>
                                    {dayWiseDataCPm.map(day => (
                                        <div key={day.id}>{day.fat}</div>
                                    ))}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>SNF</div>
                                    {dayWiseDataCPm.map(day => (
                                        <div key={day.id}>{day.snf}</div>
                                    ))}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>Col Type</div>
                                    {dayWiseDataCPm.map(day => (
                                        <div key={day.id}>{day.receipt_type}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inner-item">
                    <div>Total</div>
                    <div className="sub-inner-grid1">
                        <div className="sub-inner-item">
                            <div>-------</div>
                            <div className="sub-sub-inner-grid">
                                <div className="sub-sub-inner-item">
                                    <div>Liters</div>
                                    {(dayWiseDataCAm.length > 0 && dayWiseDataCPm.length > 0) ? (
                                        // dayWiseDataCAm.reduce((result, dayAm, index) => {
                                        // result.push(
                                        // (dayWiseDataCPm.length > 0  && (dayAm.hasOwnProperty('ltrs')))?
                                        //     <div >
                                        //         {String(dayAm.ltrs + dayWiseDataCPm[index].ltrs).slice(0, [(String(dayAm.ltrs + dayWiseDataCPm[index].ltrs)).indexOf(".") + 2]).replace(/-/g, '')}
                                        //     </div>
                                        //     : ""
                                        // );
                                        // return result;
                                        // }, [])


                                        dayWiseDataCAm.map((amObject, index) => {
                                            const pmObject = dayWiseDataCPm[index];
                                            console.log("==> ", pmObject)
                                            if (pmObject) {

                                                var litersSum = amObject.ltrs + pmObject.ltrs;
                                            }
                                            else {
                                                var litersSum = amObject.ltrs
                                            }
                                            return <div key={index}>{litersSum}</div>;
                                        })
                                    ) : (
                                        <div>--</div>
                                    )}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>FAT</div>
                                    {dayWiseDataCAm.length > 0 ? (
                                        dayWiseDataCAm.reduce((result, dayAm, index) => {
                                            result.push(
                                                // dayWiseDataCPm.length > 0 ?
                                                //     <div key={dayAm.id}>
                                                //         {String(dayAm.fat + dayWiseDataCPm[index].fat).slice(0, [(String(dayAm.fat + dayWiseDataCPm[index].fat)).indexOf(".") + 2]).replace(/-/g, '')}
                                                //     </div>
                                                //     : ""
                                            );
                                            return result;
                                        }, [])
                                    ) : (
                                        <div>--</div>
                                    )}
                                </div>
                                <div className="sub-sub-inner-item">
                                    <div>SNF</div>
                                    {dayWiseDataCAm.length > 0 ? (
                                        dayWiseDataCAm.reduce((result, dayAm, index) => {
                                            result.push(
                                                // dayWiseDataCPm.length > 0 ?
                                                //     <div key={dayAm.id}>
                                                //         {String(dayAm.snf + dayWiseDataCPm[index].snf).slice(0, [(String(dayAm.snf + dayWiseDataCPm[index].snf)).indexOf(".") + 2]).replace(/-/g, '')}
                                                //     </div>
                                                //     : ""
                                            );
                                            return result;
                                        }, [])
                                    ) : (
                                        <div>--</div>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );

    };

    return (
        <>
            <div className='container'>

                <div className='dates_container'>
                    <div className='pr-select'>
                        <label><b>PR code: &nbsp; </b></label>
                        <select value={selectedProducer?.pno} onChange={handleProducerChange} >
                            <option value="">Select a producer</option>
                            {producers.map((producer) => (
                                <option key={producer.pno} value={producer.pno}>
                                    {producer.pno} - {producer.pname}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="from_date"><b>From Date: &nbsp;</b></label>
                        <input type="date" name="from_date" id="from_date" value={fromDate ? fromDate.substr(0, 10) : ""} onChange={handleSetFromDate} className='dates' />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="to_date"><b>To Date: &nbsp;</b></label>
                        <input type="date" name="to_date" id="to_date" value={toDate ? toDate.substr(0, 10) : ""} onChange={handleSetToDate} className='dates' />
                    </div>
                </div>

                <p>{fromDate}   {toDate}</p>


                <div className='basic-info'>
                    <h2>Individual Report</h2>
                    <h4>Socient/ Collection center - {selectedSocietyX.society_name}</h4>

                    <p >Producer name: {selectedProducer ? selectedProducer.pname : ""}</p>
                    <p >Father name: {selectedProducer ? selectedProducer.fname : ""}</p>
                    <p >Phone number: {selectedProducer ? selectedProducer.phone_no : ""}</p>
                    <p >Bank name: {selectedProducer ? selectedProducer.bank_name : ""}</p>
                    <p >Account No: {selectedProducer ? selectedProducer.account_no : ""}</p>
                    <p >Caste: {selectedProducer ? selectedProducer.caste : ""}</p>
                </div>

                {fromDate && toDate ?
                    <>
                        <div className='report-button-container'>
                            <button onClick={() => handleClickerPeriodic()} className='report-button-type'>
                                <span>Periodic Report</span>
                                <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                                    <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0" />
                                </svg>
                            </button>
                        </div>

                        <div style={{ display: 'none' }} id="myDivx">
                            <div className='border-purpose'>
                                <div className='inner-frame' >
                                    <div className='first-3fr'>
                                        <div style={{ gridColumn: 'span 2' }}><span>VISAKHA DAIRY <b>{selectedBcc.hq_name}</b> HQ <b>{selectedSocietyX.society_name}</b> Collection Center</span></div>
                                        <div style={{ gridColumnStart: '3' }}><span>BCC Name : <b>{selectedBcc.bcc_name}</b></span></div>
                                    </div>
                                    <div className='first-3fr'>
                                        <div style={{ gridColumn: 'span 2' }}><span>Producer Vise Milk Collection For The Dates From <b>{fromDate.slice(0, 10)}</b> To <b>{toDate.slice(0, 10)}</b></span></div>
                                        <div style={{ gridColumnStart: '3' }}><span>Center Code: {selectedSocietyX.society_code}</span></div>

                                    </div>
                                    <div className='first-3fr'>

                                        <div><span>GL / Producer Number: <b>{selectedProducer ? selectedProducer.pno : ""}</b></span></div>

                                        <div><span>Producer Name: <b>{selectedProducer ? (selectedProducer.pname) : ""}</b></span></div>


                                    </div>
                                    <hr />

                                    <div className='first-5fr'>
                                        <div>
                                            <div><span>Father Name</span></div>
                                            <hr />
                                            <div > <span><b>{selectedProducer ? (selectedProducer.fname ? selectedProducer.fname : "NA") : "-"}</b></span> </div>

                                        </div>
                                        <div>
                                            <div><span>Caste</span></div>
                                            <hr />
                                            <div> <span><b>{selectedProducer ? (selectedProducer.caste ? selectedProducer.caste : "NA") : "-"}</b></span> </div>

                                        </div>
                                        <div>
                                            <div><span>Phone No</span></div>
                                            <hr />
                                            <div> <span><b>{selectedProducer ? (selectedProducer.phone_no ? selectedProducer.phone_no : "NA") : ""}</b></span> </div>

                                        </div>
                                        <div>
                                            <div><span>Bank Name</span></div>
                                            <hr />
                                            <div> <span><b>{selectedProducer ? (selectedProducer.bank_name ? selectedProducer.bank_name : "NA") : "-"}</b></span> </div>

                                        </div>
                                        <div>
                                            <div><span>Account Number</span></div>
                                            <hr />
                                            <div> <span><b>{selectedProducer ? (selectedProducer.account_no ? selectedProducer.account_no : "NA") : ""}</b></span> </div>

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

                                    {cattles.length > 0 ?
                                        cattles.map(cattle => (
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
                                        ))
                                        :
                                        <>
                                            <div className='first-5fr' style={{ justifyItems: 'center' }}>
                                                <div><span>-</span></div>
                                                <div><span>-</span></div>
                                                <div><span>-</span></div>
                                                <div><span>-</span></div>
                                                <div><span>-</span></div>
                                            </div>
                                            <hr />
                                        </>
                                    }
                                    <br />
                                    <br />
                                </div>

                                <div className="main-grid">
                                    <div className="inner-grid">
                                        <div className="inner-item">
                                            <div>Milk Collection</div>
                                            <div className="sub-inner-grid2">
                                                <div className="sub-inner-item">
                                                    <div>-------</div>
                                                    <div className="">
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>From Date</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.from_date.slice(0, 10)}</div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="sub-inner-item">
                                                    <div>-----------</div>
                                                    <div className="">
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>To Date</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.to_date.slice(0, 10)}</div>
                                                            ))}

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="inner-item">
                                            <div>B</div>
                                            <div className="sub-inner-grid">
                                                <div className="sub-inner-item">
                                                    <div>AM</div>
                                                    <div className="sub-sub-inner-grid">
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>Liters</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.ltrs[0][0] ? milkMain.ltrs[0][0] : "-"}</div>
                                                            ))}
                                                        </div>
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>FAT</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.fat[0][0] ? milkMain.fat[0][0] : "-"}</div>
                                                            ))}
                                                        </div>
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>SNF</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.snf[0][0] ? milkMain.snf[0][0] : "-"}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sub-inner-item">
                                                    <div>PM</div>
                                                    <div className="sub-sub-inner-grid">
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>Liters</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.ltrs[0][1] ? milkMain.ltrs[0][1] : "-"}</div>
                                                            ))}
                                                        </div>
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>FAT</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.fat[0][1] ? milkMain.fat[0][1] : "-"}</div>
                                                            ))}
                                                        </div>
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>SNF</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.snf[0][1] ? milkMain.snf[0][1] : "-"}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sub-inner-item">
                                                    <div>Total</div>
                                                    <div className="">
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>Ltrs</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{(milkMain.ltrs[0][0] + milkMain.ltrs[0][1]).toFixed(1)}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="inner-item">
                                            <div>C</div>
                                            <div className="sub-inner-grid">
                                                <div className="sub-inner-item">
                                                    <div>AM</div>
                                                    <div className="sub-sub-inner-grid">
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>Liters</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.ltrs[1] ? (milkMain.ltrs[1][0] ? milkMain.ltrs[1][0] : "-") : "-"}</div>
                                                            ))}
                                                        </div>
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>FAT</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.fat[1] ? (milkMain.fat[1][0] ? milkMain.fat[1][0] : "-") : "-"}</div>
                                                            ))}
                                                        </div>
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>SNF</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.snf[1] ? (milkMain.snf[1][0] ? milkMain.snf[1][0] : "-") : "-"}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sub-inner-item">
                                                    <div>PM</div>
                                                    <div className="sub-sub-inner-grid">
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>Liters</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.ltrs[1] ? (milkMain.ltrs[1][1] ? milkMain.ltrs[1][1] : "-") : "-"}</div>
                                                            ))}
                                                        </div>
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>FAT</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.fat[1] ? (milkMain.fat[1][1] ? milkMain.fat[1][1] : "-") : "-"}</div>
                                                            ))}
                                                        </div>
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>SNF</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.snf[1] ? (milkMain.snf[1][1] ? milkMain.snf[1][1] : "-") : "-"}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sub-inner-item">
                                                    <div>Total</div>
                                                    <div className="">
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>Ltrs</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.ltrs[1] ? ((milkMain.ltrs[1][0] || milkMain.ltrs[1][1]) ? (milkMain.ltrs[1][0] + milkMain.ltrs[1][1]).toFixed(1) : "-") : "-"}</div>
                                                            ))}
                                                        </div>
                                                        {/* <div className="sub-sub-inner-item">Sub Sub Inner Item 8</div>
                                                            <div className="sub-sub-inner-item">Sub Sub Inner Item 9</div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="inner-item">
                                            <div>Total</div>
                                            <div className="sub-inner-grid1">
                                                <div className="sub-inner-item">
                                                    <div>-------</div>
                                                    <div className="">
                                                        <div className="sub-sub-inner-item">
                                                            <div><u>Liters</u></div>
                                                            {milkMain.map((milkMain) => (
                                                                <div>{milkMain.ltrs[1] || milkMain.ltrs[1] ? ((milkMain.ltrs[0][0] || milkMain.ltrs[1][0] || milkMain.ltrs[1][1]) ? (milkMain.ltrs[1][0] + milkMain.ltrs[1][1] + milkMain.ltrs[0][0] + milkMain.ltrs[0][1]).toFixed(1) : "-") : (milkMain.ltrs[0][0] + milkMain.ltrs[0][1]).toFixed(1)}</div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>


                                <div className="main-grid" >
                                    <div className="inner-grid5">
                                        <div className="inner-item">
                                            <div>Recoveries</div>
                                            <div className="sub-inner-grid2">
                                                {recoveryFnWise.length > 0 ?
                                                    <div className="sub-inner-item">
                                                        {recoveryFnWise.map((recovery) => (
                                                            // recovery.from_date.map((from_date) => (
                                                            //     <div>{from_date.slice(0, 10)}</div>
                                                            // ))
                                                            // [...Array(recovery.amount.length)].map((e, i) => <div>{recovery.from_date.slice(0, 10)}</div>)
                                                            <div>{recovery.from_date.slice(0, 10)}</div>
                                                        ))}
                                                    </div>
                                                    :
                                                    <div className="sub-inner-item">
                                                        <div >&nbsp;</div>
                                                    </div>
                                                }

                                                {recoveryFnWise.length > 0 ?
                                                    <div className="sub-inner-item">
                                                        {recoveryFnWise.map((recovery) => (
                                                            // recovery.to_date.map((to_date) => (
                                                            //     <div>{to_date.slice(0, 10)}</div>
                                                            // ))
                                                            // [...Array(recovery.amount.length)].map((e, i) => <div>{recovery.to_date.slice(0, 10)}</div>)
                                                            <div>{recovery.to_date.slice(0, 10)}</div>
                                                        ))}
                                                    </div>
                                                    :
                                                    <div className="sub-inner-item">
                                                        <div >&nbsp;</div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="inner-item">
                                            <div>ADVANCE</div>
                                            <div className="sub-inner-grid1">
                                                {recoveryFnWise.length > 0 ?
                                                    <div className="sub-inner-item">
                                                        {recoveryFnWise.map((recovery) => (
                                                            recovery.recovery_name.map((recoveryName, index) => (
                                                                <div>{recoveryName == 'ADVANCE' ? recovery.amount[index] : null}</div>
                                                            ))
                                                            // <div>{recovery.recovery_name[0] == 'ADVANCE' ? recovery.amount[0] : "-"}</div>
                                                        ))}
                                                    </div>
                                                    :
                                                    <div className="sub-inner-item">
                                                        <div >&nbsp;</div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="inner-item">
                                            <div>CATTLE FEED</div>
                                            <div className="sub-inner-grid1">
                                                {recoveryFnWise.length > 0 ?
                                                    <div className="sub-inner-item">
                                                        {recoveryFnWise.map((recovery) => (
                                                            recovery.recovery_name.map((recoveryName, index) => (
                                                                <div>{recoveryName == 'CATTLE FEED' ? recovery.amount[index] : null}</div>
                                                            ))
                                                            // <div>{recovery.recovery_name[1] == 'CATTLE FEED' ? recovery.amount[1] : (recovery.recovery_name[0] == 'CATTLE FEED') ? recovery.amount[0] : "-"}</div>
                                                        ))}
                                                    </div>
                                                    :
                                                    <div className="sub-inner-item">
                                                        <div >&nbsp;</div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="inner-item">
                                            <div>FEED</div>
                                            <div className="sub-inner-grid1">
                                                {recoveryFnWise.length > 0 ?
                                                    <div className="sub-inner-item">
                                                        {recoveryFnWise.map((recovery) => (
                                                            recovery.recovery_name.map((recoveryName, index) => (
                                                                <div>{recoveryName == 'FEED' ? recovery.amount[index] : null}</div>
                                                            ))
                                                            // <div>{recovery.recovery_name[2] == 'FEED' ? recovery.amount[2] : (recovery.recovery_name[1] == 'FEED') ? recovery.amount[1] : ((recovery.recovery_name[0] == 'FEED') ? recovery.amount[0] : "-")}</div>
                                                        ))}
                                                    </div>
                                                    :
                                                    <div className="sub-inner-item">
                                                        <div >&nbsp;</div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="inner-item">
                                            <div>Total</div>
                                            <div className="sub-inner-grid1">
                                                {recoveryFnWise.length > 0 ?
                                                    <div className="sub-inner-item">
                                                        {recoveryFnWise.map((recovery) => (
                                                            <div>{recovery.amount.reduce((accumulator, currentValue) => accumulator + currentValue)}</div>
                                                        ))}
                                                    </div>
                                                    :
                                                    <div className="sub-inner-item">
                                                        <div >&nbsp;</div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>




                        {milkMain.map((milkMain, index) => (

                            <div style={{ border: '1px solid green', padding: '2rem', margin: '2rem 0' }}>

                                <div>
                                    <>
                                        <div>
                                            <table>
                                                <tr>
                                                    <th>S No.</th>
                                                    <th>Milk Session</th>
                                                    <th>Milk Type</th>
                                                    <th>Liters</th>
                                                    <th>Avg Fat</th>
                                                    <th>Avg SNF</th>
                                                </tr>
                                                {milkReceiptsFnConsolidatedFnwise.map(milkReceiptsFnConsolidated => (
                                                    milkReceiptsFnConsolidated.from_date == milkMain.from_date ?
                                                        <tr>
                                                            <td>1</td>
                                                            <td>{milkReceiptsFnConsolidated.milk_session}</td>
                                                            <td>{milkReceiptsFnConsolidated.milk_type}</td>
                                                            <td>{milkReceiptsFnConsolidated.ltrs}</td>
                                                            <td>{milkReceiptsFnConsolidated.fat}</td>
                                                            <td>{milkReceiptsFnConsolidated.snf}</td>
                                                        </tr>

                                                        : <></>
                                                ))}
                                            </table>
                                        </div>

                                        <div>
                                            {recoveries.length > 0 ?

                                                <table>
                                                    <tr>
                                                        <th>S No.</th>
                                                        <th>Pr No</th>
                                                        <th>Name</th>
                                                        <th>Recovery Dt</th>
                                                        <th>Recovery Name</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                    {recoveries.map(recovery => (
                                                        recovery.from_date == milkMain.from_date ?
                                                            <tr>
                                                                <td>1</td>
                                                                <td>{recovery.producer_no}</td>
                                                                <td>{recovery.recovery_name}</td>
                                                                <td>{recovery.recovery_date.slice(0, 10)}</td>
                                                                <td>{recovery.recovery_name}</td>
                                                                <td>{recovery.amount}</td>
                                                            </tr>
                                                            : <></>
                                                    ))}
                                                </table>
                                                : ""
                                            }
                                        </div>
                                    </>


                                </div>

                                {/* <div className='report-button-container'>
                                        <button onClick={() => handleClickerDaywise()} className='report-button-type'>
                                            <span>Report Daywise</span>
                                            <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                                                <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div id={`myDivDay`}>
                                        <p>Statement Showing The Individual Producer Vise Milk Collection Of <b>{selectedSocietyX.society_name}</b> Under BCC <b>{selectedBcc.bcc_name}</b></p>
                                        <hr />
                                        <p>Pr No: <b>{selectedProducer ? selectedProducer.pno : ""}   &nbsp;&nbsp;&nbsp;&nbsp;{selectedProducer ? (selectedProducer.pname) : ""}</b></p>
                                        <hr />


                                        <div className="main-grid">

                                            <DayWiseB from={milkMain.from_date} to={milkMain.to_date} />
                                            <DayWiseC from={milkMain.from_date} to={milkMain.to_date} />

                                        </div>
                                    </div> */}


                                <div className='report-button-container'>
                                    <button onClick={() => handleClicker(index)} className='report-button-type'>
                                        <span>Report</span>
                                        <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                                            <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0" />
                                        </svg>
                                    </button>
                                </div>



                                <div className='myDivx' id={`myDiv${index}`} style={{ display: 'none' }}>
                                    <div className='border-purpose'>
                                        <div className='inner-frame '>
                                            <div className='first-3fr'>
                                                <div style={{ gridColumn: 'span 2' }}><span>VISAKHA DAIRY <b>{selectedBcc.hq_name}</b> HQ <b>{selectedSocietyX.society_name}</b> Collection Center</span></div>
                                                <div style={{ gridColumnStart: '3' }}><span>BCC Name : <b>{selectedBcc.bcc_name}</b></span></div>
                                            </div>
                                            <div className='first-3fr'>
                                                <div style={{ gridColumn: 'span 2' }}><span>Producer Vise Milk Collection For The Dates From <b>{fromDate.slice(0, 10)}</b> To <b>{toDate.slice(0, 10)}</b></span></div>
                                                <div style={{ gridColumnStart: '3' }}><span>Center Code: {selectedSocietyX.society_code}</span></div>

                                            </div>
                                            <div className='first-3fr'>

                                                <div><span>GL / Producer Number: <b>{selectedProducer ? selectedProducer.pno : ""}</b></span></div>

                                                <div><span>Producer Name: <b>{selectedProducer ? (selectedProducer.pname) : ""}</b></span></div>

                                            </div>
                                            <hr />

                                            <div className='first-5fr'>
                                                <div>
                                                    <div><span>Father Name</span></div>
                                                    <hr />
                                                    <div > <span><b>{selectedProducer ? (selectedProducer.fname ? selectedProducer.fname : "NA") : "-"}</b></span> </div>

                                                </div>
                                                <div>
                                                    <div><span>Caste</span></div>
                                                    <hr />
                                                    <div> <span><b>{selectedProducer ? (selectedProducer.caste ? selectedProducer.caste : "NA") : "-"}</b></span> </div>

                                                </div>
                                                <div>
                                                    <div><span>Phone No</span></div>
                                                    <hr />
                                                    <div> <span><b>{selectedProducer ? (selectedProducer.phone_no ? selectedProducer.phone_no : "NA") : ""}</b></span> </div>

                                                </div>
                                                <div>
                                                    <div><span>Bank Name</span></div>
                                                    <hr />
                                                    <div> <span><b>{selectedProducer ? (selectedProducer.bank_name ? selectedProducer.bank_name : "NA") : "-"}</b></span> </div>

                                                </div>
                                                <div>
                                                    <div><span>Account Number</span></div>
                                                    <hr />
                                                    <div> <span><b>{selectedProducer ? (selectedProducer.account_no ? selectedProducer.account_no : "NA") : ""}</b></span> </div>

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

                                            {cattles.length > 0 ?
                                                cattles.map(cattle => (
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
                                                ))
                                                :
                                                <>
                                                    <div className='first-5fr' style={{ justifyItems: 'center' }}>
                                                        <div><span>-</span></div>
                                                        <div><span>-</span></div>
                                                        <div><span>-</span></div>
                                                        <div><span>-</span></div>
                                                        <div><span>-</span></div>
                                                    </div>
                                                    <hr />
                                                </>
                                            }
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

                                                {recoveryFnWise.map(recovery => (
                                                    recovery.from_date == milkMain.from_date ?

                                                        <>
                                                            <div className='first-7fr'  >
                                                                <div><span><b>Recoveries</b></span></div>
                                                                <div></div>
                                                                <div></div>
                                                                <div></div>
                                                                <div></div>
                                                                <div></div>
                                                                <div style={{ textAlign: 'end' }}><span>Amount</span></div>
                                                            </div>

                                                            <>
                                                                <hr />

                                                                {typeof (recovery.recovery_name) == 'object' ?
                                                                    <div className='first-3fr' >
                                                                        <div>{recovery.to_date.slice(0, 10)}</div>

                                                                        <div>
                                                                            <div>
                                                                                {recovery.recovery_name.map(rname => (
                                                                                    <span>{rname}<br /></span>
                                                                                ))}
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ textAlign: 'end' }}>
                                                                            {recovery.amount.map(ramount => (
                                                                                <span>{ramount}<br /></span>
                                                                            ))}
                                                                        </div>

                                                                    </div>
                                                                    :
                                                                    <div><span>{recovery.recovery_name}</span> <hr />
                                                                        <div className='first-3fr'>
                                                                            <div><span><b>Total</b></span></div>
                                                                            <div></div>
                                                                            <div style={{ textAlign: 'end' }}><b>{recovery.reduce((acc, recovery) => acc + recovery.amount, 0)}</b></div>
                                                                        </div>
                                                                    </div>}

                                                            </>



                                                        </>

                                                        :
                                                        <></>
                                                ))}
                                            </>
                                        </div>
                                    </div>
                                </div>


                                {/* <span>uncomment below to collapsible content</span> */}
                                {/* <div className="collapsible-button" onClick={() => toggleCollapsible(index)} style={{ display: 'flex', justifyContent: 'space-between' }}>

                                    <span>&nbsp; From {(milkMain.from_date.slice(0, 10))} To {(milkMain.to_date.slice(0, 10))}</span>
                                    <span>{openStates[index] ? "\u25b2" : "\u25bc"} &nbsp;&nbsp;&nbsp;</span>
                                </div>
                                {openStates[index] && (
                                    <div className="collapsible-content">
                                        <div className='inner-frame' id={`myDiv${index}`}>
                                            <div className='first-3fr'>
                                                <div style={{ gridColumn: 'span 2' }}><span>VISAKHA DAIRY <b>{selectedBcc.hq_name}</b> HQ <b>{selectedSocietyX.society_name}</b> Collection Center</span></div>
                                                <div style={{ gridColumnStart: '3' }}><span>BCC Name : <b>{selectedBcc.bcc_name}</b></span></div>
                                            </div>
                                            <div className='first-3fr'>
                                                <div style={{ gridColumn: 'span 2' }}><span>Producer Vise Milk Collection For The Dates From <b>{fromDate.slice(0, 10)}</b> To <b>{toDate.slice(0, 10)}</b></span></div>
                                                <div style={{ gridColumnStart: '3' }}><span>Center Code: {selectedSocietyX.society_code}</span></div>

                                            </div>
                                            <div className='first-3fr'>

                                                <div><span>GL / Producer Number: <b>{selectedProducer ? selectedProducer.pno : ""}</b></span></div>

                                                <div><span>Producer Name: <b>{selectedProducer ? (selectedProducer.pname) : ""}</b></span></div>


                                            </div>
                                            <hr />

                                            <div className='first-5fr'>
                                                <div>
                                                    <div><span>Father Name</span></div>
                                                    <hr />
                                                    <div > <span><b>{selectedProducer ? selectedProducer.fname : ""}</b></span> </div>

                                                </div>
                                                <div>
                                                    <div><span>Caste</span></div>
                                                    <hr />
                                                    <div> <span><b>{selectedProducer ? selectedProducer.caste : ""}</b></span> </div>

                                                </div>
                                                <div>
                                                    <div><span>Phone No</span></div>
                                                    <hr />
                                                    <div> <span><b>{selectedProducer ? selectedProducer.phone_no : ""}</b></span> </div>

                                                </div>
                                                <div>
                                                    <div><span>Bank Name</span></div>
                                                    <hr />
                                                    <div> <span><b>{selectedProducer ? selectedProducer.bank_name : ""}</b></span> </div>

                                                </div>
                                                <div>
                                                    <div><span>Account Number</span></div>
                                                    <hr />
                                                    <div> <span><b>{selectedProducer ? selectedProducer.account_no : ""}</b></span> </div>

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

                                                {recoveryFnWise.map(recovery => (
                                                    recovery.from_date == milkMain.from_date ?

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

                                                            <>
                                                                <hr />

                                                                {typeof (recovery.recovery_name) == 'object' ?
                                                                    <div className='first-3fr' >
                                                                        <div>{recovery.to_date.slice(0, 10)}</div>

                                                                        <div>
                                                                            <div>
                                                                                {recovery.recovery_name.map(rname => (
                                                                                    <span>{rname}<br /></span>
                                                                                ))}
                                                                                {recovery.amount.map(ramount => (
                                                                                    <span>{ramount}<br /></span>
                                                                                ))}
                                                                                <hr />
                                                                            </div>

                                                                        </div>

                                                                    </div>
                                                                    :
                                                                    <div><span>{recovery.recovery_name}</span> <hr />
                                                                        <div className='first-3fr'>
                                                                            <div><span><b>Total</b></span></div>
                                                                            <div></div>
                                                                            <div style={{ textAlign: 'end' }}><b>{recovery.reduce((acc, recovery) => acc + recovery.amount, 0)}</b></div>
                                                                        </div>
                                                                    </div>}
                                                            </>
                                                        </>
                                                        :
                                                        <></>
                                                ))}
                                            </>
                                        </div>
                                    </div>
                                )} */}

                            </div>

                        ))}
                    </>
                    : ""}



            </div>



        </>
    );
}
