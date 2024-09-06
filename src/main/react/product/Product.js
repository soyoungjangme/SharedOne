import React, {useState, useEffect} from 'react';
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
    } = useCheckboxManager();

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
        setProduct({
            productNo: data.productNo,
            productName: data.productName,
            productWriter: data.productWriter,
            productCategory: data.productCategory,
            productQty: data.productQty,
            productType: data.productType,
            productPrice: data.productPrice,
            productYn: data.productYn
        })
    }

    const [products, setProducts] = useState([]); // 리스트 데이터를 저장할 state
    // 서버에서 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await fetch('/product/products').then(res => res.json());
                setProducts(data); // 데이터를 state에 저장
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

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="date">일자</label>
                        <input className="filter-input" type="date" id="date" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productNo">상품코드</label>
                        <input className="filter-input" type="text" id="productNo" placeholder="상품코드" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productName">상품명</label>
                        <input className="filter-input" type="text" id="productName" placeholder="상품명" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productWriter">상품저자</label>
                        <input className="filter-input" type="text" id="productWriter" placeholder="상품저자" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productQty">상품수량</label>
                        <input className="filter-input" type="text" id="productQty" placeholder="상품수량" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productPrice">상품원가</label>
                        <input className="filter-input" type="text" id="productPrice" placeholder="상품원가" required/>
                    </div>


                    <button className="filter-button">조회</button>
                </div>


                <table className="seacrh-table">
                    {showDelete && <button className='delete-btn' onClick={handleDelete}>삭제</button>}
                    <thead>
                    <tr>
                        <th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange}/></th>
                        <th>No.</th>
                        <th>상품코드</th>
                        <th>상품명</th>
                        <th>상품저자</th>
                        <th>상품카테고리</th>
                        <th>상품수량</th>
                        <th>상품종류</th>
                        <th>상품원가</th>
                    </tr>
                    </thead>
                    <tbody>

                    {[{
                        id: '1',
                        code: 'A123',
                        name: '아기돼지삼형제',
                        writer: '돼지',
                        qty: 70,
                        type: '동화책',
                        price: 30000,
                        yn: 'Y'
                    },
                        {
                            id: '2',
                            code: 'C345',
                            name: '곰돌이 푸',
                            writer: '밀너',
                            qty: 60,
                            type: '동화책',
                            price: 28000,
                            yn: 'N'
                        },
                        {id: '3', code: 'D456', name: '해리포터', writer: '롤링', qty: 40, type: '소설', price: 45000, yn: 'Y'},
                        {
                            id: '4',
                            code: 'E567',
                            name: '나의 라임오렌지나무',
                            writer: '제이',
                            qty: 30,
                            type: '소설',
                            price: 35000,
                            yn: 'N'
                        },
                        {
                            id: '5',
                            code: 'F678',
                            name: '어린 왕자',
                            writer: '생텍쥐페리',
                            qty: 80,
                            type: '동화책',
                            price: 20000,
                            yn: 'Y'
                        }].map(item => (
                        <tr key={item.id} className={checkItem[item.id] ? 'selected-row' : ''}>
                            <td><input type="checkbox" checked={checkItem[item.id] || false}
                                       onChange={handleCheckboxChange}/></td>
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
    <Product/>
);