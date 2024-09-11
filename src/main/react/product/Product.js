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



    // ---------------------- 테이블 정렬 부분 ----------------------
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




    // ---------------------- 상품 삭제 부분 ----------------------
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
        if (!confirm('선택한 상품을 삭제하시겠습니까?')) {
            return;
        }

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
            alert("총 " + productNos.length + " 개의 상품이 삭제되었습니다.");
        } catch (error) {
            console.error("삭제 중 오류 발생:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };



    // ---------------------- 상품 조회 부분 ----------------------

    // 검색 필터의 상태 관리
    const [filters, setFilters] = useState({
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
            const itemPrice = parseFloat(item.productPrice);
            const filterPrice = parseFloat(filters.productPrice);

            return (
                (!filters.productName || item.productName.includes(filters.productName)) &&
                (!filters.productWriter || item.productWriter.includes(filters.productWriter)) &&
                (!filters.productCategory || item.productCategory.includes(filters.productCategory)) &&
                (!filters.productType || item.productType.toString().includes(filters.productType)) &&
                (isNaN(filterPrice) || itemPrice >= filterPrice)
            );


        });
        setOrder(filteredData);
    };

    // ---------------------- 상품 등록 모달 ----------------------
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleCSV, setIsVisibleCSV] = useState(false);
    const [productForm, setProductForm] = useState({
        productName: '',
        productWriter: '',
        productCategory: '',
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

    // 상품명 중복 체크
    const isProductNameDuplicate = (name) => {
        return productList.some(product => product.productName === name);
    };

    // 화면에 띄워진 상품명과 중복되는지 체크
    const isProductNameOnScreen = (name) => {
        return product.some(product => product.productName === name);
    };

    const handleAddProduct = () => {
        if (isFormValid()) {
            if (isProductNameOnScreen(productForm.productName)) {
                alert('동일한 상품명이 이미 화면에 있습니다.');
                return;
            }
            if (isProductNameDuplicate(productForm.productName)) {
                alert('동일한 상품명이 이미 추가된 목록에 존재합니다.');
                return;
            }

            setProductList(prevList => [
                ...prevList,
                {
                    no: prevList.length + 1,
                    ...productForm,
                    productPrice: parseInt(productForm.productPrice, 10), // 숫자 변환 시 radix 추가
                }
            ]);
            setProductForm({
                productName: '',
                productWriter: '',
                productCategory: '',
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

        if (!confirm('상품을 등록하시겠습니까?')) {
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
            alert("총 " + productList.length + " 개의 상품이 등록되었습니다.");
        } catch (error) {
            console.error('상품 등록 중 오류 발생:', error);
            alert('상품 등록 중 오류가 발생했습니다.');
        }
    };




    // ---------------------- 상품 수정 모달창 ----------------------
    const [modifyItem, setModifyItem] = useState({
        productName: '',
        productWriter: '',
        productCategory: '',
        productType: '',
        productPrice: '',
        productYn: 'Y'
    });

    const [originalItem, setOriginalItem] = useState(null);
    let [isModifyModalVisible, setIsModifyModalVisible] = useState(false);

    const handleModify = (item) => {
        setOriginalItem(item);
        setModifyItem(item);
        setIsModifyModalVisible(true);
    }

    const handleModifyCloseClick = () => {
        setIsModifyModalVisible(false);
    }

    const handleModifyItemChange = (e) => {
        const { name, value } = e.target;
        setModifyItem((prevItem) => ({
            ...prevItem,
            [name]: value,
        }));
    };

    const handleModifySubmit = async () => {
        if (!confirm('상품을 수정하시겠습니까?')) {
            return;
        }

        // 수정된 내용이 있는지 확인
        const hasChanges = Object.keys(modifyItem).some(
            key => modifyItem[key] !== originalItem[key]
        );

        if (!hasChanges) {
            alert('수정한 내용이 없습니다.');
            return;
        }

        try {
            const response = await fetch('/product/updateProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(modifyItem),
            });

            if (response.ok) {
                const result = await response.json();
                alert('상품이 수정되었습니다.');
                setIsModifyModalVisible(false);
                setProductList([]);
                await fetchData(); // 원래 화면 데이터 갱신
            } else {
                alert('상품 수정에 실패하였습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };


    return (
        <div>

            <div className="pageHeader"><h1>
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-seam-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003zM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461z" />
            </svg> */}
                <i class="bi bi-cart-check-fill"></i>
                {/* <i class="bi bi-cart-check"></i> 2번 */}
                {/* <i class="bi bi-cart-plus-fill"></i> 3번 */}
                {/* <i class="bi bi-cart-plus"></i> 4번 */}
                {/* <i class="bi bi-box-seam"></i> */}
                상품 관리</h1></div>

            {/* <i class="bi bi-chat-square-text-fill"></i> 주문관리 아이콘*/}

            <div className="main-container">
                <div className="filter-container">

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
                        <input className="filter-input" type="number" id="productPrice" placeholder="상품원가" value={filters.productPrice} onChange={handleFilterChange} />
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

                        </tr>
                    </thead>
                    <tbody>
                        {order.length > 0 ? (
                            order.map((item, index) => (
                                !item.deleted && (
                                    <tr key={index} className={checkItem[index + 1] ? 'selected-row' : ''} onDoubleClick={() => {
                                        handleModify(item)
                                    }}>
                                        <td><input type="checkbox" checked={checkItem[index + 1] || false} onChange={handleCheckboxChange} /></td>
                                        <td>{index + 1}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.productWriter}</td>
                                        <td>{item.productCategory}</td>
                                        <td>{item.productType}</td>
                                        <td>{item.productPrice}</td>
                                    </tr>
                                )
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', verticalAlign: 'middle' }}>등록된 상품이 없습니다
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-tear" viewBox="0 0 16 16" style={{ verticalAlign: 'middle' }}>
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M6.831 11.43A3.1 3.1 0 0 1 8 11.196c.916 0 1.607.408 2.25.826.212.138.424-.069.282-.277-.564-.83-1.558-2.049-2.532-2.049-.53 0-1.066.361-1.536.824q.126.27.232.535.069.174.135.373ZM6 11.333C6 12.253 5.328 13 4.5 13S3 12.254 3 11.333c0-.706.882-2.29 1.294-2.99a.238.238 0 0 1 .412 0c.412.7 1.294 2.284 1.294 2.99M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5m-1.5-3A.5.5 0 0 1 10 3c1.162 0 2.35.584 2.947 1.776a.5.5 0 1 1-.894.448C11.649 4.416 10.838 4 10 4a.5.5 0 0 1-.5-.5M7 3.5a.5.5 0 0 0-.5-.5c-1.162 0-2.35.584-2.947 1.776a.5.5 0 1 0 .894.448C4.851 4.416 5.662 4 6.5 4a.5.5 0 0 0 .5-.5" />
                                    </svg>
                                </td>
                            </tr>

                        )}
                        <tr>
                            <td colSpan="5">합계</td>
                            <td colSpan="2">{visibleCount}건</td>
                        </tr>
                    </tbody>
                </table>
            </div>


            {/* ---------------------- 등록 모달 ----------------------*/}
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
                                            <th><label htmlFor="productName">상품명</label></th>
                                            <td><input type="text" name="productName" value={productForm.productName} onChange={handleInputChange} placeholder="상품명" /></td>

                                            <th><label htmlFor="productWriter">상품저자</label></th>
                                            <td><input type="text" name="productWriter" value={productForm.productWriter} onChange={handleInputChange} placeholder="상품저자" /></td>

                                        </tr>

                                        <tr>
                                            <th><label htmlFor="productCategory">상품카테고리</label></th>
                                            <td><input type="text" name="productCategory" value={productForm.productCategory} onChange={handleInputChange} placeholder="상품카테고리" /></td>
                                            <th><label htmlFor="productType">상품종류</label></th>
                                            <td><input type="text" name="productType" value={productForm.productType} onChange={handleInputChange} placeholder="상품종류" /></td>
                                        </tr>

                                        <tr>

                                            <th><label htmlFor="productPrice">상품원가</label></th>
                                            <td><input type="number" name="productPrice" value={productForm.productPrice} onChange={handleInputChange} placeholder="상품원가" /></td>

                                            <th><label htmlFor="productYn">상품활성화</label></th>
                                            <td><input type="text" name="productYn" value={productForm.productYn} readOnly /></td>
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
                                            <th><input type="checkbox" /></th>
                                            <th>no</th>
                                            <th>상품명</th>
                                            <th>상품저자</th>
                                            <th>상품카테고리</th>
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
                                                <td>{product.productWriter}</td>
                                                <td>{product.productCategory}</td>
                                                <td>{product.productType}</td>
                                                <td>{product.productPrice}</td>
                                            </tr>
                                        ))}
                                        <tr style={{ fontWeight: 'bold' }}>
                                            <td colSpan="5">합계</td>
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


            {/* ---------------------- 수정 모달창 ----------------------*/}
            {
                isModifyModalVisible && (
                    <div className="confirmRegist">
                        <div className="fullBody">
                            <div className="form-container">
                                <button className="close-btn" onClick={handleModifyCloseClick}> &times; </button>
                                <div className="form-header">
                                    <h1>상품 수정</h1>
                                    <div className="btns">
                                        <div className="btn-add2">
                                            <button onClick={handleModifySubmit}>수정하기</button>
                                        </div>
                                        <div className="btn-close"></div>
                                    </div>
                                </div>
                                <div className="RegistForm">
                                    <table className="formTable">
                                        <tr>


                                            <th colSpan="1"><label htmlFor="productName">상품명</label></th>
                                            <td colSpan="3">
                                                <input
                                                    type="text"
                                                    name="productName"
                                                    placeholder="상품명"
                                                    value={modifyItem.productName}
                                                    onChange={handleModifyItemChange}
                                                />
                                            </td>

                                            <th colSpan="1"><label htmlFor="productWriter">상품저자</label></th>
                                            <td colSpan="3">
                                                <input
                                                    type="text"
                                                    name="productWriter"
                                                    placeholder="상품저자"
                                                    value={modifyItem.productWriter}
                                                    onChange={handleModifyItemChange}
                                                />
                                            </td>
                                        </tr>



                                        <tr>

                                            <th colSpan="1"><label htmlFor="productCategory">상품카테고리</label></th>
                                            <td colSpan="3">
                                                <input
                                                    type="text"
                                                    name="productCategory"
                                                    placeholder="상품카테고리"
                                                    value={modifyItem.productCategory}
                                                    onChange={handleModifyItemChange}
                                                />
                                            </td>


                                            <th colSpan="1"><label htmlFor="productType">상품종류</label></th>
                                            <td colSpan="3">
                                                <input
                                                    type="text"
                                                    name="productType"
                                                    placeholder="상품종류"
                                                    value={modifyItem.productType}
                                                    onChange={handleModifyItemChange}
                                                />
                                            </td>
                                        </tr>

                                        <tr>
                                            <th colSpan="1"><label htmlFor="productPrice">상품원가</label></th>
                                            <td colSpan="3">
                                                <input
                                                    type="text"
                                                    name="productPrice"
                                                    placeholder="상품원가"
                                                    value={modifyItem.productPrice}
                                                    onChange={handleModifyItemChange}
                                                />
                                            </td>

                                            <th colSpan="1"><label htmlFor="productYn">상품활성화</label></th>
                                            <td colSpan="3">
                                                <input
                                                    type="text"
                                                    name="productYn"
                                                    readOnly
                                                    placeholder="상품활성화"
                                                    value={modifyItem.productYn}
                                                />
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                )
            }
            {/* 모달창의 끝  */}


        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Product />
);