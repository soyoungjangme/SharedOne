import React, { useState } from 'react';
import ReactDOM from "react-dom/client";
import './Product.css'

function Product() {
    let [product, setProduct] = useState({
        productNo: null,
        productName: '',
        productWriter: '',
        ProductCategory: '',
        productQty: 0,
        productType: '',
        productPrice: 0,
        productYn: ''
    });

    let handleBtn = async () => {
        let data = await fetch('/product/products').then(res => res.json());
        console.log(JSON.stringify(data));
        setProduct({ productNo: data.productNo,
            productName: data.productName,
            productWriter: data.productWriter,
            productQty: data.productQty,
            productType: data.productType,
            productPrice: data.productPrice,
            productYn: data.productYn
        })
    }


    // 체크박스 선택, 삭제 버튼 생성 부분
    const [allCheck, setAllCheck] = useState(false);
    const [checkItem, setCheckItem] = useState({});
    const [showDelete, setShowDelete] = useState(false);

    const handleMasterCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setAllCheck(isChecked);

        const newCheckItem = {};
        const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const id = checkbox.parentElement.parentElement.children[1].textContent;
            newCheckItem[id] = isChecked;
        });
        setCheckItem(newCheckItem);
        setShowDelete(isChecked);
    };

    const handleCheckboxChange = (e) => {
        const id = e.target.parentElement.parentElement.children[1].textContent;
        const isChecked = e.target.checked;

        setCheckItem(prev => ({
            ...prev,
            [id]: isChecked
        }));

        // 체크된 항목이 하나라도 있으면 삭제 버튼을 보여줌
        const hasCheckedItems = Object.values({
            ...checkItem,
            [id]: isChecked
        }).some(checked => checked);

        setShowDelete(hasCheckedItems);

        // 모든 항목이 체크되지 않으면 전체 체크 해제
        if (!isChecked) {
            setAllCheck(false);
        }
    };

    const handleDelete = () => {
        const itemsToDelete = Object.keys(checkItem).filter(id => checkItem[id]);
        console.log("선택된 항목 삭제:", itemsToDelete);
        // 여기에 선택된 항목 삭제 로직을 추가하세요.
        // 예: axios.post('/delete', { ids: itemsToDelete })
    };


    return (
    <div>
    <div>
    <button type="button" onClick={handleBtn}>버튼</button>
    <h1>product(테스트):{product}</h1>
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
<label className="filter-label" for="productNo">상품코드</label>
<input className="filter-input" type="text" id="productNo" placeholder="상품코드" required/>
</div>

<div className="filter-row">
<label className="filter-label" for="productName">상품명</label>
<input className="filter-input" type="text" id="productName" placeholder="상품명" required/>
</div>

<div className="filter-row">
<label className="filter-label" for="productWriter">상품저자</label>
<input className="filter-input" type="text" id="productWriter" placeholder="상품저자" required/>
</div>

<div className="filter-row">
<label className="filter-label" for="productQty">상품수량</label>
<input className="filter-input" type="text" id="productQty" placeholder="상품수량" required/>
</div>

<div className="filter-row">
<label className="filter-label" for="productPrice">상품원가</label>
<input className="filter-input" type="text" id="productPrice" placeholder="상품원가" required/>
</div>

<div className="filter-row">
<label className="filter-label" for="productYn">상품활성화</label>
<select className="filter-select" id="productYn" required>
<option value="Y">Y</option>
<option value="N">N</option>
</select>
</div>





<button className="filter-button">조회</button>
</div>


<table className="seacrh-table">
{showDelete && <button className='delete-btn' onClick={handleDelete}>삭제</button>}
<thead>
<tr>
<th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange} /></th>
<th>No.</th>
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
{[{ id: '1', code: 'A123', name: '아기돼지삼형제', writer: '돼지', qty: 70, type: '동화책', price: 30000, yn: 'Y' },
{ id: '2', code: 'C345', name: '곰돌이 푸', writer: '밀너', qty: 60, type: '동화책', price: 28000, yn: 'N' },
{ id: '3', code: 'D456', name: '해리포터', writer: '롤링', qty: 40, type: '소설', price: 45000, yn: 'Y' },
{ id: '4', code: 'E567', name: '나의 라임오렌지나무', writer: '제이', qty: 30, type: '소설', price: 35000, yn: 'N' },
{ id: '5', code: 'F678', name: '어린 왕자', writer: '생텍쥐페리', qty: 80, type: '동화책', price: 20000, yn: 'Y' }].map(item => (
<tr key={item.id} className={checkItem[item.id] ? 'selected-row' : ''}>
<td><input type="checkbox" checked={checkItem[item.id] || false} onChange={handleCheckboxChange} /></td>
<td>{item.id}</td>
<td>{item.code}</td>
<td>{item.name}</td>
<td>{item.writer}</td>
<td>{item.qty}</td>
<td>{item.type}</td>
<td>{item.price}</td>
<td>{item.yn}</td>
</tr>
))}
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