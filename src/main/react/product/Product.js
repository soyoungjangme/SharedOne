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


    <h1> <i className="bi bi-search"></i> 결재 리스트 </h1>

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
    <td>삼국지</td>
    <td>1234</td>
    <td>반려됨</td>
    <td>12345</td>
    <td>123-45-67890</td>
    <td>02-1234-5678</td>
    <td><i className="bi bi-search"></i></td>
    </tr>

    <tr>
    <td> <input type="checkbox"/></td>
    <td>1</td>
    <td>삼국지</td>
    <td>1234</td>
    <td>승인됨</td>
    <td>12345</td>
    <td>123-45-67890</td>
    <td>02-1234-5678</td>
    <td><i className="bi bi-search"></i></td>
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