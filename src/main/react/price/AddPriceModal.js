import React, {useState} from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Price.css';
import '../js/modalAdd.css';

const AddPriceModal = ({
                           isVisible,
                           setIsVisible,
                           product,
                           customer,
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

    const handleInsertPrice = (name, value) => {
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

    const productOptions = product.map(prod => ({
        value: prod.productNo,
        label: prod.productName
    }));

    const customerOptions = customer.map(cust => ({
        value: cust.customerNo,
        label: cust.customerName
    }));

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
                        </div>
                    </div>

                    <div className="RegistForm">
                        <table className="formTable">
                            <thead>
                            <tr>
                                <th colSpan="1"><label htmlFor="registProductNo">상품</label></th>
                                <td colSpan="3">
                                    <Select
                                        name="productNo"
                                        options={productOptions}
                                        placeholder="상품 선택"
                                        onChange={(option) => handleInsertPrice('productNo', option.value)}
                                    />
                                </td>

                                <th colSpan="1"><label htmlFor="registCustomerNo">고객</label></th>
                                <td colSpan="3">
                                    <Select
                                        name="customerNo"
                                        options={customerOptions}
                                        placeholder="고객 선택"
                                        onChange={(option) => handleInsertPrice('customerNo', option.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th><label htmlFor="registCustomPrice">가격</label></th>
                                <td><input name="customPrice" type="number" placeholder="필드 입력"
                                           id="registCustomPrice"
                                           value={insertPrice.customPrice} onChange={(e) => {
                                    handleInsertPrice('customPrice', e.target.value)
                                }}/></td>

                                <th><label htmlFor="registCurrency">통화</label></th>
                                <td><input name="currency" type="text" placeholder="필드 입력" id="registCurrency"
                                           value={insertPrice.currency} onChange={(e) => {
                                    handleInsertPrice('currency', e.target.value)
                                }}/></td>

                                <th><label htmlFor="registDiscount">할인율(%)</label></th>
                                <td><input name="discount" type="number" placeholder="필드 입력" id="registDiscount"
                                           value={insertPrice.discount} onChange={(e) => {
                                    handleInsertPrice('discount', e.target.value)
                                }}/></td>
                            </tr>
                            <tr>
                                <th colSpan="1"><label htmlFor="registStartDate">시작일</label></th>
                                <td colSpan="3"><input name="startDate" type="date" placeholder="필드 입력"
                                                       id="registStartDate"
                                                       value={insertPrice.startDate} onChange={(e) => {
                                    handleInsertPrice('startDate', e.target.value)
                                }}/></td>

                                <th colSpan="1"><label htmlFor="registEndDate">종료일</label></th>
                                <td colSpan="3"><input name="endDate" type="date" placeholder="필드 입력"
                                                       id="registEndDate"
                                                       value={insertPrice.endDate} onChange={(e) => {
                                    handleInsertPrice('endDate', e.target.value)
                                }}/></td>
                            </tr>
                            </thead>
                        </table>

                        <div className="btn-add">
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
                                    <td>{item.customerNo}</td>
                                    <td>{item.customPrice}</td>
                                    <td>{item.currency}</td>
                                    <td>{item.discount}</td>
                                    <td>{item.startDate}</td>
                                    <td>{item.endDate}</td>
                                </tr>
                            ))) : (
                                <tr>
                                    <td colSpan="9">등록된 상품이 없습니다</td>
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
