import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import './Product.css'
import useCheckboxManager from "../js/CheckboxManager";

function Product() {
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager(setProduct);

    const [product, setProduct] = useState([]); // 리스트 데이터를 저장할 state
    // 서버에서 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await fetch('/product/products').then(res => res.json());
                setProduct(data); // 데이터를 state에 저장
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }
        };

        fetchData();
    }, []); // 컴포넌트가 처음 마운트될 때만 실행


    return (
        <div>

            <h1><i className="bi bi-search"></i>상품 관리</h1>

            <div className="main-container">
                <div className="filter-container">

                    {/* <div className="filter-row">
                        <label className="filter-label" htmlFor="date">일자</label>
                        <input className="filter-input" type="date" id="date" required />
                    </div> */}

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productNo">상품코드</label>
                        <input className="filter-input" type="text" id="productNo" placeholder="상품코드" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productName">상품명</label>
                        <input className="filter-input" type="text" id="productName" placeholder="상품명" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productWriter">상품저자</label>
                        <input className="filter-input" type="text" id="productWriter" placeholder="상품저자" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productWriter">상품카테고리</label>
                        <input className="filter-input" type="text" id="productWriter" placeholder="상품카테고리" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productQty">상품수량</label>
                        <input className="filter-input" type="text" id="productQty" placeholder="상품수량" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productPrice">상품원가</label>
                        <input className="filter-input" type="text" id="productPrice" placeholder="상품원가" required />
                    </div>

                    <button className="filter-button">조회</button>
                </div>


                <table className="seacrh-table">
                    {showDelete && <button className='delete-btn' onClick={handleDelete}>삭제</button>}
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange} /></th>
                            <th>상품코드</th>
                            <th>상품명</th>
                            <th>상품저자</th>
                            <th>상품카테고리</th>
                            <th>상품수량</th>
                            <th>상품종류</th>
                            <th>상품원가</th>
                            <th>상품활성화</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.length > 0 ? (
                            product.map((item, index) => (
                                <tr key={index} className={checkItem[index + 1] ? 'selected-row' : ''}>
                                    <td><input type="checkbox" checked={checkItem[index + 1] || false} onChange={handleCheckboxChange} /></td>
                                    <td>{index + 1}</td>
                                    <td>{item.productName}</td>
                                    <td>{item.productWriter}</td>
                                    <td>{item.productCategory}</td>
                                    <td>{item.productQty}</td>
                                    <td>{item.productType}</td>
                                    <td>{item.productPrice}</td>
                                    <td>{item.productYn}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">등록된 상품이 없습니다😭</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Product />
);