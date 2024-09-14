// AddPriceModal.js
import React, { useState } from 'react';
import axios from 'axios';

const AddPriceModal = ({ isVisible, setIsVisible, insertPriceList, setInsertPriceList, product, customer, fetchData }) => {
    const [insertPrice, setInsertPrice] = useState({
        productNo: '',
        customerNo: '',
        customPrice: '',
        currency: '',
        discount: '',
        startDate: '',
        endDate: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInsertPrice((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddPriceToList = () => {
        if (!insertPrice.productNo || !insertPrice.customerNo || !insertPrice.customPrice || !insertPrice.currency || !insertPrice.startDate || !insertPrice.endDate) {
            alert('모든 필드를 입력해 주세요.');
            return;
        }
        setInsertPriceList((prev) => [...prev, insertPrice]);
        setInsertPrice({
            productNo: '',
            customerNo: '',
            customPrice: '',
            currency: '',
            discount: '',
            startDate: '',
            endDate: ''
        });
    };

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
            setIsVisible(false);
        } catch (error) {
            console.error('등록 중 오류 발생:', error);
        }
    };

    return (
        isVisible && (
            <div className="modal">
                <div className="modal-content">
                    <button className="close-btn" onClick={() => setIsVisible(false)}> &times; </button>
                    <h1>고객 별 제품 판매가 등록</h1>
                    <div className="form-group">
                        <select name="productNo" onChange={handleInputChange} value={insertPrice.productNo}>
                            <option value="">상품 선택</option>
                            {product.map((item) => (
                                <option key={item.productNo} value={item.productNo}>{item.productName}</option>
                            ))}
                        </select>
                        <select name="customerNo" onChange={handleInputChange} value={insertPrice.customerNo}>
                            <option value="">고객 선택</option>
                            {customer.map((item) => (
                                <option key={item.customerNo} value={item.customerNo}>{item.customerName}</option>
                            ))}
                        </select>
                        <input name="customPrice" type="number" placeholder="가격" onChange={handleInputChange} value={insertPrice.customPrice} />
                        <input name="currency" type="text" placeholder="통화" onChange={handleInputChange} value={insertPrice.currency} />
                        <input name="discount" type="number" placeholder="할인율" onChange={handleInputChange} value={insertPrice.discount} />
                        <input name="startDate" type="date" placeholder="시작일" onChange={handleInputChange} value={insertPrice.startDate} />
                        <input name="endDate" type="date" placeholder="종료일" onChange={handleInputChange} value={insertPrice.endDate} />
                    </div>
                    <button onClick={handleAddPriceToList}>추가</button>
                    <button onClick={handleRegister}>등록하기</button>
                </div>
            </div>
        )
    );
};

export default AddPriceModal;
