import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ReactDOM from "react-dom/client";
import './Price.css';
import useCheckboxManager from "../js/CheckboxManager";
import useSort from '../js/useSort';
import '../js/modalAdd.css';

import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
} from 'chart.js';
import e from "babel-loader/lib/Error";

ChartJS.register(
    BarElement,
    LineElement,
    PointElement,  // Register PointElement
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);


function Price() {
    // Data and options for the chart
    const chartData = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        datasets: [
            {
                label: '매출액 (억 원)',
                data: [12, 19, 3, 5, 2, 3, 7, 8, 5, 9, 10, 14],
                backgroundColor: 'rgba(0, 123, 255, 0.8)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
                type: 'bar'
            },
            {
                label: '전년 대비 (%)',
                data: [5, 15, -3, -5, 2, 10, 7, 12, 5, -2, 0, 4],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
                type: 'line'
            }
        ]
    };

    const [isChartVisible, setIsChartVisible] = useState(false);

    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e0e0e0'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333'
                }
            }
        }
    };

    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager();

    const [price, setPrice] = useState([
        {
            priceNo: '',
            registerDate: '',
            productNo: '',
            customerNo: '',
            customPrice: '',
            currency: 0,
            discount: '',
            startDate: 0,
            endDate: ''
        }
    ]); // 리스트 데이터를 저장할 state

    const [product, setProduct] = useState([
        {
            productNo: '',
            productName: '',
            productWriter: '',
            productCategory: '',
            productQty: 0,
            productType: '',
            productPrice: 0,
            productYn: ''
        }
    ]); // 리스트 데이터를 저장할 state

    // 서버에서 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                let {data} = await axios('/price/all');

                setPrice(data.priceList); // 데이터를 state에 저장
                // setOrder(data.priceList);
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }
        };
        fetchData();

    }, []); // 컴포넌트가 처음 마운트될 때만 실행

    let [searchPrice, setSearchPrice] = useState({
        registerDate: '',
        productNo: '',
        customerNo: '',
        startDate: '',
        endDate: ''
    });

    let handleSearchPriceChange = (e) => {
        let copy = {...searchPrice, [e.name]: e.value};
        setSearchPrice(copy);
    }

    const handleSearchBtn = async () => {
        console.log(JSON.stringify(searchPrice));
        let {data} = await axios.post('/price/search', JSON.stringify(searchPrice), {
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log(JSON.stringify(data));
        setPrice(data);

        if (searchPrice.productNo !== '' && searchPrice.customerNo !== '') {
            setIsChartVisible(true);
        }
    }


// --- 테이블 정렬 기능
    const {sortedData, sortData, sortConfig} = useSort(price);

// --- 상세 모달창 띄우는 스크립트
    const [isVisibleDetail, setIsVisibleDetail] = useState(false);

    const handleAddClickDetail = () => {
        setIsVisibleDetail(true);
    };

    const handleCloseClickDetail = () => {
        setIsVisibleDetail(false);
    };

    const [isVisibleCSV, setIsVisibleCSV] = useState(false);

    const handleAddClickCSV = () => {
        setIsVisibleCSV((prevState) => !prevState);
    };

// --- 추가 모달창 띄우는 스크립트
    const [isVisible, setIsVisible] = useState(false);

    const handleAddClick = () => {
        setIsVisible(true);
    };

    const handleCloseClick = () => {
        setIsVisible(false);
    };

    const [modifyItem, setModifyItem] = useState([
        {
            priceNo: '',
            registerDate: '',
            productNo: '',
            customerNo: '',
            customPrice: '',
            currency: 0,
            discount: '',
            startDate: 0,
            endDate: ''
        }
    ]);
    let [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
    const handleModify = (item) => {
        setModifyItem(item);
        setIsModifyModalVisible(true);

    }

    const handleModifyCloseClick = () => {
        setIsModifyModalVisible(false);
    }

    const handleModifyItemChange = (e) => {
        let copy = {...modifyItem, [e.name]: e.value};
        setModifyItem(copy);
    }

    let [insertPrice, setInsertPrice] = useState({
        priceNo: '',
        registerDate: '',
        productNo: '',
        customerNo: '',
        customPrice: '',
        currency: 0,
        discount: '',
        startDate: 0,
        endDate: ''
    });

    const handleInsertPrice = (e) => {
        let copy = {...insertPrice, [e.name]: e.value};
        setInsertPrice(copy);
    }

    let [insertPriceList, setInsertPriceList] = useState([]);

    const handleInsertPriceList = () => {
        let copy = [...insertPriceList, insertPrice];
        setInsertPriceList(copy);
    }

    const handleRegisterAddBtn = async () => {
        if (insertPriceList.length === 0) {
            alert('값을 추가해 주세요');
            return;
        }

        await axios.post('/price/register', JSON.stringify(insertPriceList), {
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(r => {
            console.log(r);
            setIsVisible(false);
        }) ;
    }

    return (

        <div>
            <h1><i className="bi bi-search"></i> 판매가 리스트 </h1>
            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">
                            <div className="filter-item">
                                <label className="filter-label" htmlFor="product">상품</label>
                                <input name="productNo" className="filter-input" type="text" id="product"
                                       value={searchPrice.productNo}
                                       placeholder="상품"
                                       onChange={(e) => {
                                           handleSearchPriceChange(e.target)
                                       }}/>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="customer">업체</label>
                                <input name="customerNo" className="filter-input" type="text" id="customer"
                                       value={searchPrice.customerNo}
                                       placeholder="고객"
                                       onChange={(e) => {
                                           handleSearchPriceChange(e.target)
                                       }}/>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="date">등록일자</label>
                                <input name="registerDate" className="filter-input" type="date" id="date"
                                       value={searchPrice.registerDate}
                                       onChange={(e) => {
                                           handleSearchPriceChange(e.target)
                                       }}
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="startDate">시작일자</label>
                                <input name="startDate" className="filter-input" type="date" id="startDate"
                                       value={searchPrice.startDate}
                                       onChange={(e) => {
                                           handleSearchPriceChange(e.target)
                                       }}
                                />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="endDate">종료일자</label>
                                <input name="endDate" className="filter-input" type="date" id="endDate"
                                       value={searchPrice.endDate}
                                       onChange={(e) => {
                                           handleSearchPriceChange(e.target)
                                       }}/>
                            </div>
                        </div>
                    </div>
                    <div className="button-container">
                        <button type="button" className="search-btn" onClick={handleSearchBtn}><i
                            className="bi bi-search search-icon"></i>
                        </button>
                    </div>
                </div>

                {isChartVisible && <div
                    style={{width: "100%", alignItems: "center", backgroundColor: "#fcfcfc", marginBottom: "50px"}}>
                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>분기별 매출 예측</h3>
                        </div>
                        {/*<div className="canvas"><Bar data={data} options={options} /></div>*/}
                        <Bar data={chartData} options={options} className="canvas"/>
                    </div>
                </div>}

                <button className="btn-common add" type="button" onClick={handleAddClick}>
                    판매가 등록
                </button>

                <table className="search-table" style={{marginTop: "50px"}}>
                    {showDelete && <button className='delete-btn btn-common' onClick={handleDelete}>삭제</button>}
                    <thead>
                    <tr>
                        <th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange}/></th>
                        <th> No.</th>
                        <th>등록일
                            <button className="sortBtn" onClick={() => sortData('registerDate')}>
                                {sortConfig.key === 'registerDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>상품명
                            <button className="sortBtn" onClick={() => sortData('productNo')}>
                                {sortConfig.key === 'productNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>업체명
                            <button className="sortBtn" onClick={() => sortData('customerNo')}>
                                {sortConfig.key === 'customerNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>가격
                            <button className="sortBtn" onClick={() => sortData('customPrice')}>
                                {sortConfig.key === 'customPrice' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>통화
                            <button className="sortBtn" onClick={() => sortData('currency')}>
                                {sortConfig.key === 'currency' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>할인율(%)
                            <button className="sortBtn" onClick={() => sortData('discount')}>
                                {sortConfig.key === 'currency' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>시작일
                            <button className="sortBtn" onClick={() => sortData('startDate')}>
                                {sortConfig.key === 'startDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>종료일
                            <button className="sortBtn" onClick={() => sortData('endDate')}>
                                {sortConfig.key === 'endDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedData.length > 0 ? (
                        sortedData.map((item, index) => (
                            <tr key={index} className={checkItem[index] ? 'selected-row' : ''} onDoubleClick={() => {
                                handleModify(item)
                            }}>
                                <td><input type="checkbox" checked={checkItem[index] || false}
                                           onChange={handleCheckboxChange}/></td>
                                <td style={{display: 'none'}}>{index}</td>
                                <td>{index + 1}</td>
                                <td>{item.registerDate} </td>
                                <td>{item.productNo}</td>
                                <td>
                                    {item.customerNo}
                                    <i className="bi bi-search details"
                                       onClick={handleAddClickDetail}/>
                                </td>
                                <td>{item.customPrice}</td>
                                <td>{item.currency}</td>
                                <td>{item.discount}</td>
                                <td>{item.startDate}</td>
                                <td>{item.endDate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">등록된 상품이 없습니다<i class="bi bi-emoji-tear"></i></td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan="9"></td>
                        <td colSpan="1"> {sortedData.length} 건</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {isVisible && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times;
                            </button>
                            <div className="form-header">
                                <h1>고객 별 제품 판매가 등록</h1>

                                <div className="btns">
                                    <div className="btn-add2">
                                        <button onClick={handleRegisterAddBtn}> 등록하기</button>
                                    </div>
                                    <div className="btn-close">

                                    </div>
                                </div>
                            </div>


                            <div className="RegistForm">
                                <table className="formTable">
                                    <thead>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="registProductNo">상품</label></th>
                                        <td colSpan="3"><input name="productNo" type="text" placeholder="필드 입력" id="registProductNo"
                                                               value={insertPrice.productNo} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/></td>

                                        <th colSpan="1"><label htmlFor="registCustomerNo">고객</label></th>
                                        <td colSpan="3"><input name="customerNo" type="text" placeholder="필드 입력" id="registCustomerNo"
                                                               value={insertPrice.customerNo} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/></td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="registCustomPrice">가격</label></th>
                                        <td><input name="price" type="number" placeholder="필드 입력" id="registCustomPrice"
                                                   value={insertPrice.customPrice} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/></td>

                                        <th><label htmlFor="registCurrency">통화</label></th>
                                        <td><input name="currency" type="text" placeholder="필드 입력" id="registCurrency"
                                                   value={insertPrice.currency} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/></td>

                                        <th><label htmlFor="registDiscount">할인율(%)</label></th>
                                        <td><input name="discount" type="number" placeholder="필드 입력" id="registDiscount"
                                                   value={insertPrice.discount} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/></td>
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="registStartDate">시작일</label></th>
                                        <td colSpan="3"><input name="startDate" type="date" placeholder="필드 입력" id="registStartDate"
                                                               value={insertPrice.startDate} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/>
                                        </td>

                                        <th colSpan="1"><label htmlFor="registEndDate">종료일</label></th>
                                        <td colSpan="3"><input name="endDate" type="date" placeholder="필드 입력" id="registEndDate"
                                                               value={insertPrice.endDate} onChange={(e) => {
                                            handleInsertPrice(e.target)
                                        }}/></td>
                                    </tr>
                                    </thead>
                                </table>


                                <div className="btn-add">
                                    <button id="downloadCsv" className="btn-CSV">CSV 샘플 양식</button>
                                    <button id="uploadCsv" className="btn-CSV" onClick={handleAddClickCSV}>CSV 파일 업로드
                                    </button>
                                    {isVisibleCSV && (
                                        <input type="file" id="uploadCsvInput" accept=".csv"/>)}

                                    <button className="btn-common btn-add-p" onClick={handleInsertPriceList}> 추가
                                    </button>
                                </div>
                            </div>

                            <div className="RegistFormList">
                                <div style={{fontWeight: 'bold'}}> 총 N 건</div>
                                <table className="formTableList">
                                    <thead>
                                    <tr>
                                        <th><input type="checkbox"/></th>
                                        <th>no</th>
                                        <th>상품</th>
                                        <th>고객</th>
                                        <th>가격</th>
                                        <th>통화</th>
                                        <th>할인율</th>
                                        <th>시작일</th>
                                        <th>종료일</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {insertPriceList.length > 0 ? (insertPriceList.map((item, index) => (
                                        <tr key={index}>
                                            <td><input type="checkbox" checked={checkItem[index] || false}
                                                       onChange={handleCheckboxChange}/></td>
                                            <td style={{display: 'none'}}>{index}</td>
                                            <td>{index + 1}</td>
                                            <td>{item.productNo}</td>
                                            <td>
                                                {item.customerNo}
                                                <i className="bi bi-search details"
                                                   onClick={handleAddClickDetail}/>
                                            </td>
                                            <td>{item.customPrice}</td>
                                            <td>{item.currency}</td>
                                            <td>{item.discount}</td>
                                            <td>{item.startDate}</td>
                                            <td>{item.endDate}</td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            <td colSpan="10">등록된 상품이 없습니다<i class="bi bi-emoji-tear"></i></td>
                                        </tr>
                                    )}

                                    {/*<tr style={{fontWeight: 'bold'}}>*/}
                                    {/*    <td colSpan="9"> 합계</td>*/}
                                    {/*    <td colSpan="1"> 13,000,000</td>*/}
                                    {/*</tr>*/}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {/* 모달창의 끝  */}

            {/* 수정 모달창 */}
            {isModifyModalVisible && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleModifyCloseClick}> &times;
                            </button>
                            <div className="form-header">
                                <h1>고객 별 제품 판매가 수정</h1>

                                <div className="btns">
                                    <div className="btn-add2">
                                        <button> 수정하기</button>
                                    </div>
                                    <div className="btn-close">

                                    </div>
                                </div>
                            </div>


                            <div className="RegistForm">
                                <table className="formTable">
                                    <tr>
                                        <th colSpan="1"><label htmlFor="modifyProductNo">상품</label></th>
                                        <td colSpan="3"><input name="productNo" type="text" placeholder="필드 입력" id="modifyProductNo"
                                                               value={modifyItem.productNo} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>

                                        <th colSpan="1"><label htmlFor="modifyCustomerNo">고객</label></th>
                                        <td colSpan="3"><input name="customerNo" type="text" placeholder="필드 입력" id="modifyCustomerNo"
                                                               value={modifyItem.customerNo} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="modifyCustomPrice">가격</label></th>
                                        <td><input name="customPrice" type="number" placeholder="필드 입력" id="modifyCustomPrice"
                                                   value={modifyItem.customPrice} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>

                                        <th><label htmlFor="modifyCurrency">통화</label></th>
                                        <td><input name="currency" type="text" placeholder="필드 입력" id="modifyCurrency"
                                                   value={modifyItem.currency} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>

                                        <th><label htmlFor="modifyDiscount">할인율(%)</label></th>
                                        <td><input name="discount" type="number" placeholder="필드 입력" id="modifyDiscount"
                                                   value={modifyItem.discount} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="modifyStartDate">연락처</label></th>
                                        <td colSpan="3"><input name="startDate" type="text" placeholder="필드 입력" id="modifyStartDate"
                                                               value={modifyItem.startDate} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/>
                                        </td>

                                        <th colSpan="1"><label htmlFor="modifyEndDate">연락처</label></th>
                                        <td colSpan="3"><input name="endDate" type="text" placeholder="필드 입력" id="modifyEndDate"
                                                               value={modifyItem.endDate} onChange={(e) => {
                                            handleModifyItemChange(e.target)
                                        }}/></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* 수정 모달창 끝  */}

            {/* 새로운 모달창 */}
            {isVisibleDetail && (

                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClickDetail}> &times;
                            </button>
                            <div className="form-header">
                                <h1> 고객 상세보기 </h1>

                                <div className="btns">
                                    <div className="btn-close">

                                    </div>
                                </div>
                            </div>


                            {/*<div className="RegistForm">*/}
                            {/*    <table className="formTable">*/}
                            {/*        <tr>*/}
                            {/*            <th colSpan="1"><label htmlFor="productNo">상품</label></th>*/}
                            {/*            <td colSpan="3"><input type="text" placeholder="필드 입력" id="productNo"*/}
                            {/*                                   value={modifyItem.productNo} onChange={(e) => {*/}
                            {/*                handleModifyItemChange(e.target)*/}
                            {/*            }}/></td>*/}

                            {/*            <th colSpan="1"><label htmlFor="customerNo">고객</label></th>*/}
                            {/*            <td colSpan="3"><input type="text" placeholder="필드 입력" id="customerNo"*/}
                            {/*                                   value={modifyItem.customerNo} onChange={(e) => {*/}
                            {/*                handleModifyItemChange(e.target)*/}
                            {/*            }}/></td>*/}
                            {/*        </tr>*/}
                            {/*        <tr>*/}
                            {/*            <th><label htmlFor="customPrice">가격</label></th>*/}
                            {/*            <td><input type="number" placeholder="필드 입력" id="customPrice"*/}
                            {/*                       value={modifyItem.customPrice} onChange={(e) => {*/}
                            {/*                handleModifyItemChange(e.target)*/}
                            {/*            }}/></td>*/}

                            {/*            <th><label htmlFor="currency">통화</label></th>*/}
                            {/*            <td><input type="text" placeholder="필드 입력" id="currency"*/}
                            {/*                       value={modifyItem.currency} onChange={(e) => {*/}
                            {/*                handleModifyItemChange(e.target)*/}
                            {/*            }}/></td>*/}

                            {/*            <th><label htmlFor="discount">할인율(%)</label></th>*/}
                            {/*            <td><input type="number" placeholder="필드 입력" id="discount"*/}
                            {/*                       value={modifyItem.discount} onChange={(e) => {*/}
                            {/*                handleModifyItemChange(e.target)*/}
                            {/*            }}/></td>*/}
                            {/*        </tr>*/}
                            {/*        <tr>*/}
                            {/*            <th colSpan="1"><label htmlFor="registStartDate">연락처</label></th>*/}
                            {/*            <td colSpan="3"><input type="text" placeholder="필드 입력" id="registStartDate"*/}
                            {/*                                   value={modifyItem.startDate} onChange={(e) => {*/}
                            {/*                handleModifyItemChange(e.target)*/}
                            {/*            }}/>*/}
                            {/*            </td>*/}

                            {/*            <th colSpan="1"><label htmlFor="registEndDate">연락처</label></th>*/}
                            {/*            <td colSpan="3"><input type="text" placeholder="필드 입력" id="registEndDate"*/}
                            {/*                                   value={modifyItem.endDate} onChange={(e) => {*/}
                            {/*                handleModifyItemChange(e.target)*/}
                            {/*            }}/></td>*/}
                            {/*        </tr>*/}
                            {/*    </table>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            )}


        </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Price/>
);