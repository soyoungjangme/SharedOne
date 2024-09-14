// AddPriceModal.js
import React, {useState} from 'react';
import axios from 'axios';
import './Price.css';
import '../js/modalAdd.css';

const AddPriceModal = ({
                           isVisible,
                           setIsVisible,
                           productOptions,
                           customerOptions,
                           fetchData,
                           handleCloseClick
                       }) => {
    const [insertPrice, setInsertPrice] = useState({
        productNo: '',
        customerNo: '',
        customPrice: '',
        currency: '',
        discount: '',
        startDate: '',
        endDate: ''
    });

    const handleInsertPrice = (e) => {
        const {name, value} = e;
        setInsertPrice((prev) => ({...prev, [name]: value}));
    }

    let [insertPriceList, setInsertPriceList] = useState([]);

    const handleInsertPriceList = () => {
        if (insertPrice.productNo === '') {
            alert('제품을 선택해 주세요.');
            return;
        }
        if (insertPrice.customerNo === '') {
            alert('고객을 선택해 주세요.');
            return;
        }
        if (insertPrice.customPrice === '') {
            alert('가격을 입력해 주세요.');
            return;
        }
        if (insertPrice.currency === '') {
            alert('화폐 통화를 입력해 주세요.');
            return;
        }
        if (insertPrice.startDate === '') {
            alert('판매가 적용 시작일을 선택해 주세요.');
            return;
        }
        if (insertPrice.endDate === '') {
            alert('판매가 적용 기한을 선택해 주세요.');
            return;
        }

        let copy = [...insertPriceList, insertPrice];
        setInsertPriceList(copy);
    }

    const handleRegister = async () => {
        if (insertPriceList.length === 0) {
            alert('추가된 판매가가 없습니다.');
            return;
        }
        try {
            await axios.post('/price/register', insertPriceList, {
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            fetchData();
            alert('등록 되었습니다');
            setIsVisible(false);
        } catch (error) {
            console.error('등록 중 오류 발생:', error);
        }
    };

    return (isVisible &&
        <div className="confirmRegist">
            <div className="fullBody">
                <div className="form-container">
                    <button className="close-btn" onClick={handleCloseClick}> &times;
                    </button>
                    <div className="form-header">
                        <h1>고객 별 제품 판매가 등록</h1>

                        <div className="btns">
                            <div className="btn-add2">
                                <button onClick={handleRegister}> 등록하기</button>
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
                                <td colSpan="3">
                                    <select name="productNo" className="filter-input" id="registProductNo"
                                            placeholder="상품"
                                            onChange={(e) => {
                                                handleInsertPrice(e.target)
                                            }}>
                                        {productOptions}
                                    </select>
                                </td>

                                <th colSpan="1"><label htmlFor="registCustomerNo">고객</label></th>
                                <td colSpan="3">
                                    <select name="customerNo" className="filter-input" id="registCustomerNo"
                                            placeholder="고객"
                                            onChange={(e) => {
                                                handleInsertPrice(e.target)
                                            }}>
                                        {customerOptions}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th><label htmlFor="registCustomPrice">가격</label></th>
                                <td><input name="customPrice" type="number" placeholder="필드 입력"
                                           id="registCustomPrice"
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
                                <td colSpan="3"><input name="startDate" type="date" placeholder="필드 입력"
                                                       id="registStartDate"
                                                       value={insertPrice.startDate} onChange={(e) => {
                                    handleInsertPrice(e.target)
                                }}/>
                                </td>

                                <th colSpan="1"><label htmlFor="registEndDate">종료일</label></th>
                                <td colSpan="3"><input name="endDate" type="date" placeholder="필드 입력"
                                                       id="registEndDate"
                                                       value={insertPrice.endDate} onChange={(e) => {
                                    handleInsertPrice(e.target)
                                }}/></td>
                            </tr>
                            </thead>
                        </table>
                        <div className="btn-add">
                            {/*<button id="downloadCsv" className="btn-CSV">CSV 샘플 양식</button>*/}
                            {/*<button id="uploadCsv" className="btn-CSV" onClick={handleAddClickCSV}>CSV 파일 업로드*/}
                            {/*</button>*/}
                            {/*{isVisibleCSV && (*/}
                            {/*    <input type="file" id="uploadCsvInput" accept=".csv"*/}
                            {/*           onChange={handleFileChange}/>)}*/}

                            <button className="btn-common btn-add-p" onClick={handleInsertPriceList}> 추가
                            </button>
                        </div>
                    </div>

                    <div className="RegistFormList">
                        <div style={{fontWeight: 'bold'}}> 총 N 건</div>
                        <table className="formTableList">
                            <thead>
                            <tr>
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
                                    <td>{index + 1}</td>
                                    <td>{item.productNo}</td>
                                    <td>
                                        {item.customerNo}
                                        {/*<i className="bi bi-search details"*/}
                                        {/*   onClick={handleAddClickDetail}/>*/}
                                    </td>
                                    <td>{item.customPrice}</td>
                                    <td>{item.currency}</td>
                                    <td>{item.discount}</td>
                                    <td>{item.startDate}</td>
                                    <td>{item.endDate}</td>
                                </tr>
                            ))) : (
                                <tr>
                                    {/*<td colSpan="10">등록된 상품이 없습니다<i className="bi bi-emoji-tear"></i></td>*/}
                                    <td colSpan="9">등록된 상품이 없습니다
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-emoji-tear"
                                             viewBox="0 0 16 16">
                                            <path
                                                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                            <path
                                                d="M6.831 11.43A3.1 3.1 0 0 1 8 11.196c.916 0 1.607.408 2.25.826.212.138.424-.069.282-.277-.564-.83-1.558-2.049-2.532-2.049-.53 0-1.066.361-1.536.824q.126.27.232.535.069.174.135.373ZM6 11.333C6 12.253 5.328 13 4.5 13S3 12.254 3 11.333c0-.706.882-2.29 1.294-2.99a.238.238 0 0 1 .412 0c.412.7 1.294 2.284 1.294 2.99M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5m-1.5-3A.5.5 0 0 1 10 3c1.162 0 2.35.584 2.947 1.776a.5.5 0 1 1-.894.448C11.649 4.416 10.838 4 10 4a.5.5 0 0 1-.5-.5M7 3.5a.5.5 0 0 0-.5-.5c-1.162 0-2.35.584-2.947 1.776a.5.5 0 1 0 .894.448C4.851 4.416 5.662 4 6.5 4a.5.5 0 0 0 .5-.5"/>
                                        </svg>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPriceModal;
