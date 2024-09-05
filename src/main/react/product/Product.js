import React, { useState } from 'react';
import ReactDOM from "react-dom/client";
import axios from 'axios';
import './Product.css'

function Product() {
    let [product, setProduct] = useState({
        productNo: null,
        productName: '',
        productWriter: '',
        productQty: 0,
        productType: '',
        productPrice: 0
    });


    let handleBtn = async () => {
        let data = await fetch('/product/products').then(res => res.json());
        console.log(JSON.stringify(data));
        setProduct({ productNo: data.productNo,
            productName: data.productName,
            productWriter: data.productWriter,
            productQty: data.productQty,
            productType: data.productType,
            productPrice: data.productPrice});
    }


    return (
    <div>
        <div>
            <button type="button" onClick={handleBtn}>버튼</button>
            <h1>productPrice:{product.productPrice}</h1>

        </div>




    <h1> <i className="bi bi-search"></i>상품 관리</h1>

    <div className="breadcrumb">
    <a href="#">
    <span className="home-icon"></span>
    </a>
    <span className="separator"></span>
    <a href="#">상품정보</a>
    <span class="separator"></span>
    <a className="#">상품정보조회</a>
    </div>



    <div className="main-container">
    <div className="filter-container">

    <div className="filter-row">
    <label className="filter-label" for="date">일자</label>
    <input className="filter-input" type="date" id="date" required />
    </div>

    <div className="filter-row">
    <label className="filter-label" for="manager">담당자</label>
    <input className="filter-input" type="text" id="manager" placeholder="담당자" required/>
    </div>

    <div className="filter-row">
    <label className="filter-label" for="warehouse">창고</label>
    <input className="filter-input" type="text" id="warehouse" placeholder="출하창고" required/>
    </div>

    <div className="filter-row">
    <label className="filter-label" for="transaction">거래처</label>
    <input className="filter-input" type="text" id="transaction" placeholder="거래처" required/>
    </div>

    <div className="filter-row">
    <label className="filter-label" for="department">부서</label>
    <input className="filter-input" type="text" id="department" placeholder="부서" required/>
    </div>

    <div className="filter-row">
    <label className="filter-label" for="transactionType">거래유형</label>
    <select className="filter-select" id="transactionType" required>
    <option value="부가세율 적용">부가세율 적용</option>
    <option value="부가세율 미적용">부가세율 미적용</option>
    </select>
    </div>
    <div className="filter-row">
    <label className="filter-label" for="transactionType">거래유형</label>
    <select className="filter-select" id="transactionType" required>
    <option value="부가세율 적용">부가세율 적용</option>
    <option value="부가세율 미적용">부가세율 미적용</option>
    </select>
    </div>
    <div className="filter-row">
    <label className="filter-label" for="transactionType">거래유형</label>
    <select className="filter-select" id="transactionType" required>
    <option value="부가세율 적용">부가세율 적용</option>
    <option value="부가세율 미적용">부가세율 미적용</option>
    </select>
    </div>

    <div className="filter-row">
    <label className="filter-label" for="transactionType">거래유형</label>
    <select className="filter-select" id="transactionType" required>
    <option value="부가세율 적용">부가세율 적용</option>
    <option value="부가세율 미적용">부가세율 미적용</option>
    </select>
    </div>
    <div className="filter-row">
    <label className="filter-label" for="warehouse">창고</label>
    <input className="filter-input" type="text" id="warehouse" placeholder="출하창고" required/>
    </div>

    <div className="filter-row">
    <label className="filter-label" for="transaction">거래처</label>
    <input className="filter-input" type="text" id="transaction" placeholder="거래처" required/>
    </div>

    <div className="filter-row">
    <label className="filter-label" for="department">부서</label>
    <input className="filter-input" type="text" id="department" placeholder="부서" required/>
    </div>


    <button className="filter-button">조회</button>
    </div>


    <table className="seacrh-table">
    <thead>
    <tr>
    <th><input type="checkbox"/></th>
    <th> No.</th>
    <th>상품코드</th>
    <th>상품명</th>
    <th>상품 저자</th>
    <th>상품수량</th>
    <th>상품종류</th>
    <th>상품 원가</th>
    <th>상품활성화</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td> <input type="checkbox"/></td>
    <td>1</td>
    <td>A123</td>
    <td>아기돼지삼형제</td>
    <td>돼지</td>
    <td>70</td>
    <td>동화책</td>
    <td>30,000</td>
    <td>Y</td>
    </tr>
    <tr>
    <td><input type="checkbox"/></td>
    <td>3</td>
    <td>C345</td>
    <td>곰돌이 푸</td>
    <td>밀너</td>
    <td>60</td>
    <td>동화책</td>
    <td>28,000</td>
    <td>N</td>
    </tr>
    <tr>
    <td><input type="checkbox"/></td>
    <td>4</td>
    <td>D456</td>
    <td>해리포터</td>
    <td>롤링</td>
    <td>40</td>
    <td>소설</td>
    <td>45,000</td>
    <td>Y</td>
    </tr>
    <tr>
    <td><input type="checkbox"/></td>
    <td>5</td>
    <td>E567</td>
    <td>나의 라임오렌지나무</td>
    <td>제이</td>
    <td>30</td>
    <td>소설</td>
    <td>35,000</td>
    <td>N</td>
    </tr>
    <tr>
    <td><input type="checkbox"/></td>
    <td>6</td>
    <td>F678</td>
    <td>어린 왕자</td>
    <td>생텍쥐페리</td>
    <td>80</td>
    <td>동화책</td>
    <td>20,000</td>
    <td>Y</td>
    </tr>



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