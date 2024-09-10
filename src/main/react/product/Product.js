import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import './Product.css'
import './modalAdd.css'
import './modalDetail.css'
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
    const fetchData = async () => {
        try {
            let data = await fetch('/product/products').then(res => res.json());
            const filterData = data.filter(product => product.productYn === 'Y');
            setProduct(filterData); // 데이터를 state에 저장
            setOrder(filterData);
        } catch (error) {
            console.error("데이터를 가져오는 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchData(); // 컴포넌트가 처음 마운트될 때 데이터 가져오기
    }, []);


    // --- 테이블 정렬 기능

    // 상품 데이터를 저장하는 상태
    const [order, setOrder] = useState([]); // 리스트 데이터를 저장할 state


    // 정렬 상태와 방향을 저장하는 상태
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

    // 정렬 함수
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        const sortOrder = [...order].sort((a, b) => { //order배열 정렬(매개변수 비교)
            if (a[key] < b[key]) { // key는 변수명임 (ex. orderNo, manage, title ...)
                return direction === 'ascending' ? -1 : 1; //
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setOrder(sortOrder);
        setSortConfig({ key, direction });
    };


    // --- 테이블 정렬 기능


    //삭제 부분
    useEffect(() => {
        // 데이터가 로드된 이후에 삭제된 항목을 로컬 스토리지에서 필터링
        if (product.length > 0) {
            const deletedItems = JSON.parse(localStorage.getItem('deletedItems')) || [];
            console.log("로컬 스토리지에서 삭제된 항목:", deletedItems);

            setOrder(prevOrder => {
                console.log("초기 상품 리스트:", prevOrder);
                return prevOrder.filter(item => !deletedItems.includes(item.productNo));
            });
        }
    }, [product]);  // product가 로드된 후 실행

    useEffect(() => {
        // 삭제된 항목을 로컬 스토리지에 저장
        const deletedItems = order.filter(item => item.deleted).map(item => item.productNo);
        console.log("저장할 삭제된 항목:", deletedItems);
        localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
    }, [order]);

    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        // 화면에 보이는 행 개수 계산
        const count = order.filter(item => !item.deleted).length;
        setVisibleCount(count);
    }, [order]);

    const handleDeleteClick = async () => {
        const isConfirmed = window.confirm("삭제하시겠습니까?");

        if (isConfirmed) {
            try {
                // 체크된 항목의 인덱스를 추출하여 삭제할 인덱스 배열로 변환
                const itemsToDelete = Object.keys(checkItem)
                    .filter(id => checkItem[id])
                    .map(id => parseInt(id) - 1);

                console.log("삭제할 항목 인덱스:", itemsToDelete);

                // 삭제 처리
                setOrder(prevOrder => {
                    const updatedOrder = prevOrder.filter((item, index) => !itemsToDelete.includes(index));
                    console.log("업데이트된 상품 리스트:", updatedOrder);
                    return updatedOrder;
                });

                // 로컬 스토리지에 삭제된 항목 저장
                const deletedItems = JSON.parse(localStorage.getItem('deletedItems')) || [];
                const updatedDeletedItems = [...deletedItems, ...itemsToDelete];
                localStorage.setItem('deletedItems', JSON.stringify(updatedDeletedItems));
                console.log("저장할 삭제된 항목:", updatedDeletedItems);

                // 삭제된 항목을 서버에 전송하여 DB 업데이트
                const productNos = itemsToDelete.map(index => order[index].productNo);
                await fetch('/product/updateProductYn', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productNos),
                });
                // 체크박스 상태 초기화
                setCheckItem({});
                setAllCheck(false);

                alert("삭제가 완료되었습니다.");

            } catch (error) {
                console.error("삭제 중 오류 발생:", error);
                alert("삭제 중 오류가 발생했습니다.");
            }
        } else {
            //삭제 취소 시 아무런 동작 하지 않음
        }
    };




    //조회 부분

    // 검색 필터의 상태 관리
    const [filters, setFilters] = useState({
        productNo: '',
        productName: '',
        productWriter: '',
        productCategory: '',
        productType: '',
        productPrice: ''
    });


    // 검색 필터 핸들러
    const handleFilterChange = (e) => {
        const { id, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [id]: value
        }));
    };

    // 조회 버튼 클릭 시 필터링
    const handleSearch = () => {
        const filteredData = product.filter(item => {
            return (
                (!filters.productNo || String(item.productNo).includes(filters.productNo)) &&
                (!filters.productName || item.productName.includes(filters.productName)) &&
                (!filters.productWriter || item.productWriter.includes(filters.productWriter)) &&
                (!filters.productCategory || item.productCategory.includes(filters.productCategory)) &&
                (!filters.productType || item.productType.toString().includes(filters.productType)) &&
                (!filters.productPrice || item.productPrice.toString().includes(filters.productPrice))
            );
        });
        setOrder(filteredData);
    };


    // ---  모달창 띄우는 스크립트
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleCSV, setIsVisibleCSV] = useState(false);
    const [productForm, setProductForm] = useState({
        employeeId: '',
        employeePw: '',
        productName: '',
        productNo: '',
        productWriter: '',
        productCategory: '',
        productQty: '',
        productType: '',
        productPrice: '',
        productYn: 'Y'
    });
    const [productList, setProductList] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm({
            ...productForm,
            [name]: value
        });
    };

    const handleAddClick = () => {
        setIsVisible(true);
    };

    const handleCloseClick = () => {
        setIsVisible(false);
    };

    const handleAddClickCSV = () => {
        setIsVisibleCSV(prevState => !prevState);
    };

    const isFormValid = () => {
        const { productYn, ...otherFields } = productForm;
        return Object.values(otherFields).every(value => value.trim() !== '');
    };


    const handleAddProduct = () => {
        if (isFormValid()) {
            setProductList(prevList => [
                ...prevList,
                {
                    no: prevList.length + 1,
                    ...productForm,
                    productQty: parseInt(productForm.productQty),
                    productPrice: parseInt(productForm.productPrice),
                }
            ]);
            setProductForm({
                employeeId: '',
                employeePw: '',
                productName: '',
                productNo: '',
                productWriter: '',
                productCategory: '',
                productQty: '',
                productType: '',
                productPrice: '',
                productYn: 'Y'
            });
        } else {
            alert('상품 정보를 모두 입력해야 합니다.');
        }
    };

    const handleSubmit = async () => {
        if (productList.length === 0) {
            alert('추가한 상품이 없습니다. 상품을 추가한 후 등록해 주세요.');
            return;
        }
        try {
            // 상품 등록 API 호출
            await Promise.all(productList.map(product =>
                fetch('/product/addProduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                })
            ));
            // 성공적으로 등록 후 상태 초기화 및 원래 화면 데이터 갱신
            setProductList([]);
            await fetchData(); // 원래 화면 데이터 갱신
            // 모달 창 닫기
            setIsVisible(false);
            alert('상품이 등록되었습니다.');
        } catch (error) {
            console.error('상품 등록 중 오류 발생:', error);
            alert('상품 등록 중 오류가 발생했습니다.');
        }
    }




    const hasProductsToAdd = () => {
        return productList.length > 0;
    };

    const isSubmitDisabled = !isFormValid() || !hasProductsToAdd();






    return (
        <div>

            <div className="pageHeader"><h1><i className="bi bi-search"></i>상품 관리</h1></div>

            <div className="main-container">
                <div className="filter-container">

                    {/* <div className="filter-row">
                        <label className="filter-label" htmlFor="date">일자</label>
                        <input className="filter-input" type="date" id="date" required />
                    </div> */}

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productNo">상품코드</label>
                        <input className="filter-input" type="text" id="productNo" placeholder="상품코드" value={filters.productNo} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productName">상품명</label>
                        <input className="filter-input" type="text" id="productName" placeholder="상품명" value={filters.productName} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productWriter">상품저자</label>
                        <input className="filter-input" type="text" id="productWriter" placeholder="상품저자" value={filters.productWriter} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productCategory">상품카테고리</label>
                        <input className="filter-input" type="text" id="productCategory" placeholder="상품카테고리" value={filters.productCategory} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productType">상품종류</label>
                        <input className="filter-input" type="text" id="productType" placeholder="상품종류" value={filters.productType} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="productPrice">상품원가</label>
                        <input className="filter-input" type="text" id="productPrice" placeholder="상품원가" value={filters.productPrice} onChange={handleFilterChange} />
                    </div>

                    <button className="filter-button" onClick={handleSearch}>조회</button>
                </div>
                <button className="filter-button" id="add" type="button" onClick={handleAddClick}>상품 등록</button>

                {showDelete && <button className='delete-btn' onClick={() => { handleDeleteClick(); handleDelete(); }}>삭제</button>}
                <table className="search-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange} /></th>
                            <th> No.</th>
                            <th>상품코드
                                <button className="sortBtn" onClick={() => sortData('productNo')}>
                                    {sortConfig.key === 'productNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>상품명
                                <button className="sortBtn" onClick={() => sortData('productName')}>
                                    {sortConfig.key === 'productName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>상품저자
                                <button className="sortBtn" onClick={() => sortData('productWriter')}>
                                    {sortConfig.key === 'productWriter' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>상품카테고리
                                <button className="sortBtn" onClick={() => sortData('productCategory')}>
                                    {sortConfig.key === 'productCategory' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>상품수량
                                <button className="sortBtn" onClick={() => sortData('productQty')}>
                                    {sortConfig.key === 'productQty' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>상품종류
                                <button className="sortBtn" onClick={() => sortData('productType')}>
                                    {sortConfig.key === 'productType' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>상품원가
                                <button className="sortBtn" onClick={() => sortData('productPrice')}>
                                    {sortConfig.key === 'productPrice' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>상품활성화
                                <button className="sortBtn" onClick={() => sortData('productYn')}>
                                    {sortConfig.key === 'productYn' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.length > 0 ? (
                            order.map((item, index) => (
                                !item.deleted && (
                                    <tr key={index} className={checkItem[index + 1] ? 'selected-row' : ''}>
                                        <td><input type="checkbox" checked={checkItem[index + 1] || false} onChange={handleCheckboxChange} /></td>
                                        <td>{index + 1}</td>
                                        <td>{item.productNo}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.productWriter}</td>
                                        <td>{item.productCategory}</td>
                                        <td>{item.productQty}</td>
                                        <td>{item.productType}</td>
                                        <td>{item.productPrice}</td>
                                        <td>{item.productYn}</td>
                                    </tr>
                                )
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">등록된 상품이 없습니다😭</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="8">합계</td>
                            <td colSpan="2">{visibleCount}건</td>
                        </tr>
                    </tbody>
                </table>
            </div>


            {/* 여기 아래는 모달이다. */}
            {isVisible && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times; </button>
                            <div className="form-header">
                                <h1>상품등록</h1>
                                <div className="btns">
                                    <div className="btn-add2">
                                        <button onClick={handleSubmit} disabled={productList.length === 0}>등록하기</button>
                                    </div>
                                </div>
                            </div>

                            <div className="RegistForm">
                                <table className="formTable">
                                    <tbody>
                                        <tr>
                                            <th><label htmlFor="employeeId">직원 ID</label></th>
                                            <td><input type="text" name="employeeId" value={productForm.employeeId} onChange={handleInputChange} placeholder="직원 ID" /></td>

                                            <th><label htmlFor="employeePw">직원 PW</label></th>
                                            <td><input type="text" name="employeePw" value={productForm.employeePw} onChange={handleInputChange} placeholder="직원 PW" /></td>
                                        </tr>
                                        <tr>
                                            <th><label htmlFor="productName">상품명</label></th>
                                            <td><input type="text" name="productName" value={productForm.productName} onChange={handleInputChange} placeholder="상품명" /></td>

                                            <th><label htmlFor="productNo">상품코드</label></th>
                                            <td><input type="number" name="productNo" value={productForm.productNo} onChange={handleInputChange} placeholder="상품코드" /></td>


                                        </tr>
                                        <tr>
                                            <th><label htmlFor="productCategory">상품카테고리</label></th>
                                            <td><input type="text" name="productCategory" value={productForm.productCategory} onChange={handleInputChange} placeholder="상품카테고리" /></td>

                                            <th><label htmlFor="productQty">상품수량</label></th>
                                            <td><input type="number" name="productQty" value={productForm.productQty} onChange={handleInputChange} placeholder="상품수량" /></td>
                                        </tr>
                                        <tr>
                                            <th><label htmlFor="productType">상품종류</label></th>
                                            <td><input type="text" name="productType" value={productForm.productType} onChange={handleInputChange} placeholder="상품종류" /></td>

                                            <th><label htmlFor="productWriter">상품저자</label></th>
                                            <td><input type="text" name="productWriter" value={productForm.productWriter} onChange={handleInputChange} placeholder="상품저자" /></td>

                                        </tr>
                                        <th><label htmlFor="productPrice">상품원가</label></th>
                                        <td><input type="number" name="productPrice" value={productForm.productPrice} onChange={handleInputChange} placeholder="상품원가" /></td>

                                        <th><label htmlFor="productYn">상품활성화</label></th>
                                        <td><input type="text" name="productYn" value={productForm.productYn} readOnly /></td>
                                        <tr>

                                        </tr>
                                    </tbody>
                                </table>

                                <button id="downloadCsv">CSV 샘플 양식</button>
                                <button id="uploadCsv" onClick={handleAddClickCSV}>CSV 파일 업로드</button>
                                {isVisibleCSV && (
                                    <input type="file" id="uploadCsvInput" accept=".csv" />
                                )}

                                <div className="btn-add">
                                    <button onClick={handleAddProduct}>추가</button>
                                </div>
                            </div>

                            <div className="RegistFormList">
                                <div style={{ fontWeight: 'bold' }}> 총 {productList.length} 건</div>
                                <table className="formTableList">
                                    <thead>
                                        <tr>
                                            <th><input type="checkbox"/></th>
                                            <th>no</th>
                                            <th>상품명</th>
                                            <th>상품코드</th>
                                            <th>상품저자</th>
                                            <th>상품카테고리</th>
                                            <th>상품수량</th>
                                            <th>상품종류</th>
                                            <th>상품원가</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productList.map((product, index) => (
                                            <tr key={index}>
                                                <td><input type="checkbox" /></td>
                                                <td>{index + 1}</td>
                                                <td>{product.productName}</td>
                                                <td>{product.productNo}</td>
                                                <td>{product.productWriter}</td>
                                                <td>{product.productCategory}</td>
                                                <td>{product.productQty}</td>
                                                <td>{product.productType}</td>
                                                <td>{product.productPrice}</td>
                                            </tr>
                                        ))}
                                        <tr style={{ fontWeight: 'bold' }}>
                                            <td colSpan="7">합계</td>
                                            <td colSpan="2">
                                                {productList.length}건
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {/* 모달창의 끝  */}

            {/* 수정 모달창 */}
            {/* {isModifyModalVisible && (
                <div class="confirmRegist">
                    <div class="fullBody">
                        <div class="form-container">
                            <button className="close-btn" onClick={handleModifyCloseClick}> &times;
                            </button>
                            <div class="form-header">
                                <h1>직원 등록</h1>
                                <div class="btns">
                                    <div class="btn-add2">
                                        <button> 등록하기</button>
                                    </div>
                                    <div class="btn-close">

                                    </div>
                                </div>
                            </div>
                            <div class="RegistForm">
                                <table class="formTable">
                                    <tr>
                                        <th colSpan="1"><label for="">직원 ID</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" value={modifyItem.productNo} /></td>

                                        <th colSpan="1"><label for="">직원 PW</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" value={modifyItem.productNo} /></td>
                                    </tr>
                                    <tr>
                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.productNo} /></td>
                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.productNo} /></td>
                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.productNo} /></td>
                                        <th><label for="">직원 ID</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.productNo} /></td>
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label for="">연락처</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" value={modifyItem.productNo} /></td>
                                        <th colSpan="1"><label for="">연락처</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" value={modifyItem.productNo} /></td>
                                    </tr>
                                    <tr>
                                        <th colSpan="1"><label for="">연락처</label></th>
                                        <td colSpan="3"><select>
                                            <option>담당 직원</option>
                                        </select></td>
                                        <th colSpan="1"><label for="">연락처</label></th>
                                        <td colSpan="3"><select>
                                            <option>담당 직원</option>
                                        </select></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            )} */}
            {/* 모달창의 끝  */}


        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Product />
);