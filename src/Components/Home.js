import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from "react-router-dom";

export function Home() {
    const history = useHistory();


    const [milkReceiptsFnConsolidated, setMilkReceiptsFnConsolidated] = useState([]);

    useEffect(() => {

        axios.get(`http://localhost:9000/milk-receipts-fn-consolidated`)
            .then(response => {
                console.log("milkReceiptsFnConsolidated:  ", response.data)
                setMilkReceiptsFnConsolidated(response.data);
            })
            .catch(error => {
                console.log(error);
            });

    }, []);

    const [fromDate, setFromDate] = useState("")
    useEffect(() => {
        if (milkReceiptsFnConsolidated.length > 0) {
            setFromDate(milkReceiptsFnConsolidated[0].from_date);
        }
    }, [milkReceiptsFnConsolidated]);

    function handleSetFromDate(event) {
        setFromDate(event.target.value);
        console.log(fromDate)
    }

    const [toDate, setToDate] = useState("")
    useEffect(() => {
        if (milkReceiptsFnConsolidated.length > 0) {
            setToDate(milkReceiptsFnConsolidated[0].to_date);
        }
    }, [milkReceiptsFnConsolidated]);

    function handleSetToDate(event) {
        setToDate(event.target.value);
        console.log(toDate)
    }

    const [milkReceiptsFnConsolidatedFn, setMilkReceiptsFnConsolidatedFn] = useState([]);

    useEffect(() => {
        if (fromDate && toDate) {
            axios.get(`http://localhost:9000/milk-receipts-fn-consolidated/${fromDate.slice(0, 10)}/${toDate.slice(0, 10)}`)
                .then(response => {
                    console.log("setMilkReceiptsFnConsolidated  ", response.data)
                    setMilkReceiptsFnConsolidatedFn(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setMilkReceiptsFnConsolidatedFn([]);
        }

    }, [fromDate, toDate]);


    const [user, setUser] = useState(null);
    useEffect(() => {
        axios.get('http://localhost:9000/home', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                window.location.href = '/';
                console.log(error);
            });
    }, []);


    const [headquarters, setHeadquarters] = useState([]);
    const [selectedHeadquarter, setSelectedHeadquarter] = useState(null);

    function handleHeadquarterClick(headquarter) {
        console.log(headquarter)
        setSelectedHeadquarter(headquarter);
    }


    useEffect(() => {
        if (user) {
            axios.get('http://localhost:9000/headquarters', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {

                    if (user.user_type === "HQ") {
                        const selectedHQ = response.data.find(
                            (headquarter) => headquarter.hq_code === user.user_type_code
                        );
                        setSelectedHeadquarter(selectedHQ);
                        setHeadquarters([selectedHQ, ...response.data.filter((h) => h.hq_code !== user.user_type_code)]);
                    }
                    else {
                        setHeadquarters(response.data);
                    }
                })
                .catch(error => {
                    window.location.href = '/';
                    console.log(error);
                });
        }
    }, [user]);


    const [bccs, setBccs] = useState([]);
    const [selectedBcc, setSelectedBcc] = useState(null);

    function handleBccClick(bcc) {
        if (isNaN(bcc.bcc_code)) {
            bcc.bcc_code = bcc.bcc_code[0]
        }
        console.log(typeof (bcc.bcc_code), "ssd")
        setSelectedBcc(bcc);
    }



    useEffect(() => {
        if (selectedHeadquarter && (user?.user_type == "Admin" || user?.user_type == "HQ")) {
            axios.get(`http://localhost:9000/headquarters/${selectedHeadquarter.hq_code}/bcc`)
                .then(response => {
                    console.log(response.data)
                    setBccs(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        } else if (user?.user_type === 'BCC') {
            axios.get(`http://localhost:9000/bcc/${user.user_name}`)
                .then(response => {
                    console.log(response.data)
                    setBccs(response.data);

                    const selectedHq = response.data[0];
                    console.log(selectedHq, "  selectedHq")
                    setHeadquarters(response.data);
                    setSelectedHeadquarter(selectedHq);
                    //   setSelectedHeadquarter(response.data[0].hq_code);
                    //   setHeadquarters(response.data[0].hq_code);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setBccs([]);
        }
    }, user?.user_type === 'BCC' ? [user] : [selectedHeadquarter, user]);

    // useEffect(() => {
    //     if (selectedHeadquarter) {
    //         axios.get(`http://localhost:9000/headquarters/${selectedHeadquarter.hq_code}/bcc`)
    //             .then(response => {
    //                 setBccs(response.data);
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //     } else {
    //         setBccs([]);
    //     }
    // }, [selectedHeadquarter]);


    const [societies, setSocieties] = useState([]);
    const [selectedSociety, setSelectedSociety] = useState(null);

    // function handleSocietyClick(society) {
    //     setSelectedSociety(society);
    // }


    useEffect(() => {
        if (selectedBcc) {
            axios.get(`http://localhost:9000/headquarters/${selectedHeadquarter.hq_code}/bcc/${selectedBcc.bcc_code}/societies`)
                .then(response => {
                    setSocieties(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        } else if (user?.user_type === 'Society') {
            axios.get(`http://localhost:9000/bcc/${user.user_name}/society`)
                .then(response => {
                    console.log(response.data);

                    const selectedHq = response.data.find(hq => hq.hq_code === response.data[0].hq_code);
                    const selectedBcc = response.data.find(bcc => bcc.bcc_code === response.data[0].bcc_code);
                    setHeadquarters(response.data);
                    setSelectedHeadquarter(selectedHq);
                    setSelectedBcc(selectedBcc);

                    axios.get(`http://localhost:9000/headquarters/${selectedHq.hq_code}/bcc`)
                        .then(response => {
                            setBccs(response.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });

                    axios.get(`http://localhost:9000/headquarters/${selectedHq.hq_code}/bcc/${selectedBcc.bcc_code[0]}/societies/${user.bcc_code}`)
                        .then(response => {
                            console.log("final society", response.data)
                            setSelectedSociety(response.data[0]);
                            setSocieties(response.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setSocieties([]);
        }
    }, [selectedHeadquarter, selectedBcc, user]);

    //////
    const [societiesFn, setSocietiesFn] = useState([]);
    const [selectedSocietyFn, setSelectedSocietyFn] = useState(null);

    function handleSocietyClickFn(society) {
        let result = societies.find(obj => obj.society_code === society.society_code);
        setSelectedSociety(result);
        setSelectedSocietyFn(society);
    }


    useEffect(() => {
        if (selectedBcc && fromDate && toDate) {
            axios.get(`http://localhost:9000/bcc/${selectedBcc.bcc_code}/societies/${fromDate.slice(0, 10)}/${toDate.slice(0, 10)}`)
                .then(response => {
                    setSocietiesFn(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        } else if (user?.user_type === 'Society') {
            axios.get(`http://localhost:9000/bcc/${user.user_name}/society`)
                .then(response => {
                    console.log(response.data);

                    const selectedHq = response.data.find(hq => hq.hq_code === response.data[0].hq_code);
                    const selectedBcc = response.data.find(bcc => bcc.bcc_code === response.data[0].bcc_code);
                    setHeadquarters(response.data);
                    setSelectedHeadquarter(selectedHq);
                    setSelectedBcc(selectedBcc);

                    axios.get(`http://localhost:9000/headquarters/${selectedHq.hq_code}/bcc`)
                        .then(response => {
                            setBccs(response.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });

                    axios.get(`http://localhost:9000/headquarters/${selectedHq.hq_code}/bcc/${selectedBcc.bcc_code[0]}/societies/${user.bcc_code}`)
                        .then(response => {
                            console.log("final society", response.data)
                            setSelectedSocietyFn(response.data[0]);
                            setSocietiesFn(response.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setSocietiesFn([]);
        }
    }, [selectedHeadquarter, selectedBcc, user]);


    const [missedList, setMissedList] = useState([]);
    useEffect(() => {
        console.log("societies: ", societies)
        console.log("societiesFn: ", societiesFn)
        if (selectedBcc) {
            let result = societies.filter(obj1 => !societiesFn.some(obj2 => obj1.society_code === obj2.society_code));
            console.log("missedList: ", result)
            setMissedList(result)
        }
        // else if (user?.user_type === 'Society') {

        // } else {
        //     setSocieties([]);
        // }
    }, [selectedBcc, societies, user, societiesFn]);
    /////
    // useEffect(() => {
    //     if (selectedBcc) {
    //         axios.get(`http://localhost:9000/headquarters/${selectedHeadquarter.hq_code}/bcc/${selectedBcc.bcc_code}/societies`)
    //             .then(response => {
    //                 setBccs(response.data);
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //     } else if (user?.user_type === 'Society') {
    //         axios.get(`http://localhost:9000/bcc/${user.user_name}/society`)
    //             .then(response => {
    //                 console.log(response.data)

    //                 const selectedHq = response.data.find(hq => hq.hq_code === response.data[0].hq_code);
    //                 const selectedBcc = response.data.find(bcc => bcc.bcc_code === response.data[0].bcc_code);
    //                 setHeadquarters(response.data);
    //                 setSelectedHeadquarter(selectedHq);
    //                 setBccs(response.data);
    //                 setSelectedBcc(selectedBcc);
    //                 console.log("->   ", selectedHeadquarter.hq_code, " -> ", selectedBcc.bcc_code[0], " -> ", user.bcc_code)
    //                 axios.get(`http://localhost:9000/headquarters/${selectedHeadquarter.hq_code}/bcc/${selectedBcc.bcc_code[0]}/societies/${user.bcc_code}`)
    //                     .then(response => {
    //                         console.log("final society", response.data)
    //                         setSelectedSociety(response.data[0]);
    //                         setSocieties(response.data);
    //                     })
    //                     .catch(error => {
    //                         console.log(error);
    //                     });

    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //     } else {
    //         setSocieties([]);
    //     }
    // }, [selectedHeadquarter, selectedBcc, user]);

    // useEffect(() => {
    //     if (selectedBcc) {
    //         axios.get(`http://localhost:9000/headquarters/${selectedHeadquarter.hq_code}/bcc/${selectedBcc.bcc_code}/societies`)
    //             .then(response => {
    //                 setSocieties(response.data);
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //     } else {
    //         setBccs([]);
    //     }
    // }, [selectedHeadquarter, selectedBcc]);


    const [selectedSocietyX, setSelectedSocietyX] = useState(null);
    useEffect(() => {
        if (selectedSociety) {
            setSelectedSocietyX(selectedSociety)
        } else {
            setSocieties([]);
        }
    }, [selectedHeadquarter, selectedBcc, selectedSociety]);



    const handleReportClick = () => {
        console.log("bcc- ", selectedBcc)
        console.log("selectedSocietyX- ", selectedSocietyX)
        console.log("fromDate- ", fromDate)
        console.log("toDate- ", toDate)

        history.push({
            pathname: '/individual-report',
            state: { selectedBcc, selectedSocietyX, fromDate, toDate }
        });
    };



    return (
        <section className='container'>

            <div className='dates_container'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label for="from_date"><b>From Date: &nbsp;</b></label>
                    <input type="date" name="from_date" id="from_date" value={fromDate} onChange={handleSetFromDate} className='dates' />
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label for="to_date"><b>To Date: &nbsp;</b></label>
                    <input type="date" name="to_date" id="to_date" value={fromDate} onChange={handleSetToDate} className='dates' />
                </div>
            </div>

            {/* <p>{fromDate}   {toDate}</p>
            <div>
                {user ? <h1>{user.user_type}   {user.user_type_code}</h1> : <p>Loading...</p>}
                {selectedHeadquarter ? selectedHeadquarter.hq_name : ""}
            </div> */}

            <div className='sections-container'>
                <div className='headquartes-section'>
                    <h2>Headquarters</h2>
                    <div className='lister'>

                        <ul>
                            {headquarters.map(headquarter => (
                                <li key={headquarter.hq_code} onClick={() => handleHeadquarterClick(headquarter)}>{headquarter.hq_name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='bcc-section'>
                    <h2>BCC</h2>
                    <div className='lister'>
                        <ul>
                            {bccs.map(bcc => (
                                <li key={bcc.bcc_code} onClick={() => handleBccClick(bcc)} >{bcc.bcc_name}</li>
                            ))}
                        </ul>
                    </div>
                    {/* <div>{selectedBcc ? selectedBcc.bcc_name : ""}</div> */}
                </div>
                <div className='society-code-section'>
                    <h2>Society Available</h2>
                    <div className='lister'>
                        <ul>
                            {societiesFn.map(society => (
                                <li key={society.society_code} onClick={() => handleSocietyClickFn(society)} ><b>{society.society_code}</b> - {society.society_name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='society-code-section'>
                    <h2>Society Not</h2>
                    <div className='lister'>
                        <ul>
                            {missedList.map(society => (
                                <li key={society.society_code}  >{society.society_code}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='society-name-section'>
                    <h2>Selected Society</h2>
                    <div className='lister'>
                        <ul>
                            {selectedSocietyX ? <li>{selectedSocietyX.society_name}</li> : ""}

                        </ul>
                    </div>
                </div>
            </div>


            <div className='buttons-container'>
                <button onClick={handleReportClick} className='report-button'>Go to Individual Report</button>
            </div>

        </section>
    );
}
