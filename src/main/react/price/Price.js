import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from '../js/Chart';
import SearchForm from './SearchForm';
import PriceTable from './PriceTable';
import AddPriceModal from './AddPriceModal';
import ModifyPriceModal from './ModifyPriceModal';
import DetailModal from './DetailModal';
import Pagination from '../js/Pagination';
import useCheckboxManager from '../js/CheckboxManager';
import useSort from '../js/useSort';
import ReactDOM from "react-dom/client";

import './Price.css';
import '../js/modalAdd.css';
import '../js/Pagination.css';

const Price = () => {
    const [price, setPrice] = useState([]);
    const [product, setProduct] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [searchPrice, setSearchPrice] = useState({
        registerDate: '',
        productNo: '',
        customerNo: '',
        startDate: '',
        endDate: '',
        page: 1,
        amount: 10,
    });
    const [isChartVisible, setIsChartVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
    const [isVisibleDetail, setIsVisibleDetail] = useState(false);
    const [modalDetailTitle, setModalDetailTitle] = useState('');
    const [modalDetailData, setModalDetailData] = useState({});
    const [modifyItem, setModifyItem] = useState({});
    const [insertPriceList, setInsertPriceList] = useState([]);
    const { sortedData, sortData, sortConfig } = useSort(price);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(100); // 총 아이템 수
    const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 아이템 수
    const [pageCount, setPageCount] = useState(10); // 총 페이지 수 계산
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete,
    } = useCheckboxManager();

    useEffect(() => {
        fetchData();
        handleSearchBtn();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await axios('/price/all');
            setProduct(data.productList);
            setCustomer(data.customerList);
        } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
        }
    };

    const handleSearchBtn = async () => {
        await getSearchItems(searchPrice);
        // if (searchPrice.productNo && searchPrice.customerNo) {
        //     setIsChartVisible(true);
        // }
    };

    const getSearchItems = async (item) => {
        const { data } = await axios.post('/price/search', item, {
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
            },
        });
        setPrice(data.pageData);
        setCurrentPage(data.page);
        setTotalItems(data.total);
        setItemsPerPage(data.pageData.length);
        setPageCount(data.realEnd);
        setSearchPrice((prev) => ({ ...prev, page: data.page }));
    };

    const handlePageChange = async (selectedPage) => {
        let copy = {...searchPrice, page: selectedPage.selected+1};
        await getSearchItems(copy).then(r => console.log(r));
    };

    const handleModify = (item) => {
        setModifyItem(item);
        setIsModifyModalVisible(true);
    };

    const handleAddClickDetail = (title, id) => {
        const data = title === 'product'
            ? product.find((item) => item.productNo === id)
            : customer.find((item) => item.customerNo === id);
        setModalDetailData(data);
        setModalDetailTitle(title);
        setIsVisibleDetail(true);
    };
//-------------------------------------------------------------------

    //키 (상품코드) : 값 (상품이름)
    // console.log(product);
    //
    //
    // const [inputValue, setInputValue] = useState('');
    // const [filteredOptions, setFilteredOptions] = useState([]);
    // const browsers = ['아기돼지삼형제', '데미안', '위대한 개츠비', '어린 왕자', '부리부리대마왕의 지구정복이야기', '해리포터'];
    //
    // const handleInputChange = (event) => {
    //     const value = event.target.value;
    //     setInputValue(value);
    //
    //     if (value) {
    //         const filtered = browsers.filter((browser) =>
    //             browser.toLowerCase().includes(value.toLowerCase())
    //         );
    //         setFilteredOptions(filtered);
    //     } else {
    //         setFilteredOptions([]);
    //     }
    // };
    //
    // const handleOptionClick = (option) => {
    //     setInputValue(option);
    //     setFilteredOptions([]);
    // };

    return (
        <div>
            <h1><i className="bi bi-currency-dollar"></i> 판매가 리스트 </h1>
            <SearchForm
                searchPrice={searchPrice}
                setSearchPrice={setSearchPrice}
                product={product}
                customer={customer}
                handleSearchBtn={handleSearchBtn}
            />
            {isChartVisible && <Chart />}
            <button className="btn-common add" type="button" onClick={() => setIsVisible(true)}>
                판매가 등록
            </button>
            <PriceTable
                price={sortedData}
                checkItem={checkItem}
                handleCheckboxChange={handleCheckboxChange}
                handleMasterCheckboxChange={handleMasterCheckboxChange}
                handleModify={handleModify}
                handleAddClickDetail={handleAddClickDetail}
                sortData={sortData}
                sortConfig={sortConfig}
                showDelete={showDelete}
                handleDelete={handleDelete}
            />
            <Pagination
                pageCount={pageCount} // 총 페이지 수
                onPageChange={handlePageChange} // 페이지 변경 이벤트 핸들러
                currentPage={currentPage} // 현재 페이지
                total={totalItems} // 총 아이템 수
            />
            {isVisible && <AddPriceModal
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                insertPriceList={insertPriceList}
                setInsertPriceList={setInsertPriceList}
                product={product}
                customer={customer}
                fetchData={fetchData}
            />}
            {isModifyModalVisible && <ModifyPriceModal
                isVisible={isModifyModalVisible}
                setIsVisible={setIsModifyModalVisible}
                modifyItem={modifyItem}
                fetchData={fetchData}
            />}
            {isVisibleDetail && <DetailModal
                title={modalDetailTitle}
                data={modalDetailData}
                setIsVisibleDetail={setIsVisibleDetail}
            />}


        {/*    {isVisible && (*/}
        {/*        <div className="confirmRegist">*/}
        {/*            <div className="fullBody">*/}
        {/*                <div className="form-container">*/}
        {/*                    <button className="close-btn" onClick={handleCloseClick}> &times;*/}
        {/*                    </button>*/}
        {/*                    <div className="form-header">*/}
        {/*                        <h1>고객 별 제품 판매가 등록</h1>*/}

        {/*                        <div className="btns">*/}
        {/*                            <div className="btn-add2">*/}
        {/*                                <button onClick={handleRegisterAddBtn}> 등록하기</button>*/}
        {/*                            </div>*/}
        {/*                            <div className="btn-close">*/}

        {/*                            </div>*/}
        {/*                        </div>*/}
        {/*                    </div>*/}


        {/*                    <div className="RegistForm">*/}
        {/*                        <table className="formTable">*/}
        {/*                            <thead>*/}
        {/*                            <tr>*/}
        {/*                                <th colSpan="1"><label htmlFor="registProductNo">상품</label></th>*/}
        {/*                                <td colSpan="3">*/}
        {/*                                    <select name="productNo" className="filter-input" id="registProductNo"*/}
        {/*                                            placeholder="상품"*/}
        {/*                                            onChange={(e) => {*/}
        {/*                                                handleInsertPrice(e.target)*/}
        {/*                                            }}>*/}
        {/*                                        {productOptions}*/}
        {/*                                    </select>*/}
        {/*                                </td>*/}

        {/*                                <th colSpan="1"><label htmlFor="registCustomerNo">고객</label></th>*/}
        {/*                                <td colSpan="3">*/}
        {/*                                    <select name="customerNo" className="filter-input" id="registCustomerNo"*/}
        {/*                                            placeholder="고객"*/}
        {/*                                            onChange={(e) => {*/}
        {/*                                                handleInsertPrice(e.target)*/}
        {/*                                            }}>*/}
        {/*                                        {customerOptions}*/}
        {/*                                    </select>*/}
        {/*                                </td>*/}
        {/*                            </tr>*/}
        {/*                            <tr>*/}
        {/*                                <th><label htmlFor="registCustomPrice">가격</label></th>*/}
        {/*                                <td><input name="customPrice" type="number" placeholder="필드 입력"*/}
        {/*                                           id="registCustomPrice"*/}
        {/*                                           value={insertPrice.customPrice} onChange={(e) => {*/}
        {/*                                    handleInsertPrice(e.target)*/}
        {/*                                }}/></td>*/}

        {/*                                <th><label htmlFor="registCurrency">통화</label></th>*/}
        {/*                                <td><input name="currency" type="text" placeholder="필드 입력" id="registCurrency"*/}
        {/*                                           value={insertPrice.currency} onChange={(e) => {*/}
        {/*                                    handleInsertPrice(e.target)*/}
        {/*                                }}/></td>*/}

        {/*                                <th><label htmlFor="registDiscount">할인율(%)</label></th>*/}
        {/*                                <td><input name="discount" type="number" placeholder="필드 입력" id="registDiscount"*/}
        {/*                                           value={insertPrice.discount} onChange={(e) => {*/}
        {/*                                    handleInsertPrice(e.target)*/}
        {/*                                }}/></td>*/}
        {/*                            </tr>*/}
        {/*                            <tr>*/}
        {/*                                <th colSpan="1"><label htmlFor="registStartDate">시작일</label></th>*/}
        {/*                                <td colSpan="3"><input name="startDate" type="date" placeholder="필드 입력"*/}
        {/*                                                       id="registStartDate"*/}
        {/*                                                       value={insertPrice.startDate} onChange={(e) => {*/}
        {/*                                    handleInsertPrice(e.target)*/}
        {/*                                }}/>*/}
        {/*                                </td>*/}

        {/*                                <th colSpan="1"><label htmlFor="registEndDate">종료일</label></th>*/}
        {/*                                <td colSpan="3"><input name="endDate" type="date" placeholder="필드 입력"*/}
        {/*                                                       id="registEndDate"*/}
        {/*                                                       value={insertPrice.endDate} onChange={(e) => {*/}
        {/*                                    handleInsertPrice(e.target)*/}
        {/*                                }}/></td>*/}
        {/*                            </tr>*/}
        {/*                            </thead>*/}
        {/*                        </table>*/}


        {/*                        <div className="btn-add">*/}
        {/*                            /!*<button id="downloadCsv" className="btn-CSV">CSV 샘플 양식</button>*!/*/}
        {/*                            /!*<button id="uploadCsv" className="btn-CSV" onClick={handleAddClickCSV}>CSV 파일 업로드*!/*/}
        {/*                            /!*</button>*!/*/}
        {/*                            /!*{isVisibleCSV && (*!/*/}
        {/*                            /!*    <input type="file" id="uploadCsvInput" accept=".csv"*!/*/}
        {/*                            /!*           onChange={handleFileChange}/>)}*!/*/}

        {/*                            <button className="btn-common btn-add-p" onClick={handleInsertPriceList}> 추가*/}
        {/*                            </button>*/}
        {/*                        </div>*/}
        {/*                    </div>*/}

        {/*                    <div className="RegistFormList">*/}
        {/*                        <div style={{fontWeight: 'bold'}}> 총 N 건</div>*/}
        {/*                        <table className="formTableList">*/}
        {/*                            <thead>*/}
        {/*                            <tr>*/}
        {/*                                <th><input type="checkbox"/></th>*/}
        {/*                                <th>no</th>*/}
        {/*                                <th>상품</th>*/}
        {/*                                <th>고객</th>*/}
        {/*                                <th>가격</th>*/}
        {/*                                <th>통화</th>*/}
        {/*                                <th>할인율</th>*/}
        {/*                                <th>시작일</th>*/}
        {/*                                <th>종료일</th>*/}
        {/*                            </tr>*/}
        {/*                            </thead>*/}
        {/*                            <tbody>*/}
        {/*                            {insertPriceList.length > 0 ? (insertPriceList.map((item, index) => (*/}
        {/*                                <tr key={index}>*/}
        {/*                                    <td><input type="checkbox" checked={checkItem[index] || false}*/}
        {/*                                               onChange={handleCheckboxChange}/></td>*/}
        {/*                                    <td style={{display: 'none'}}>{index}</td>*/}
        {/*                                    <td>{index + 1}</td>*/}
        {/*                                    <td>{item.productNo}</td>*/}
        {/*                                    <td>*/}
        {/*                                        {item.customerNo}*/}
        {/*                                        <i className="bi bi-search details"*/}
        {/*                                           onClick={handleAddClickDetail}/>*/}
        {/*                                    </td>*/}
        {/*                                    <td>{item.customPrice}</td>*/}
        {/*                                    <td>{item.currency}</td>*/}
        {/*                                    <td>{item.discount}</td>*/}
        {/*                                    <td>{item.startDate}</td>*/}
        {/*                                    <td>{item.endDate}</td>*/}
        {/*                                </tr>*/}
        {/*                            ))) : (*/}
        {/*                                <tr>*/}
        {/*                                    /!*<td colSpan="10">등록된 상품이 없습니다<i className="bi bi-emoji-tear"></i></td>*!/*/}
        {/*                                    <td colSpan="10">등록된 상품이 없습니다*/}
        {/*                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"*/}
        {/*                                             fill="currentColor" className="bi bi-emoji-tear"*/}
        {/*                                             viewBox="0 0 16 16">*/}
        {/*                                            <path*/}
        {/*                                                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>*/}
        {/*                                            <path*/}
        {/*                                                d="M6.831 11.43A3.1 3.1 0 0 1 8 11.196c.916 0 1.607.408 2.25.826.212.138.424-.069.282-.277-.564-.83-1.558-2.049-2.532-2.049-.53 0-1.066.361-1.536.824q.126.27.232.535.069.174.135.373ZM6 11.333C6 12.253 5.328 13 4.5 13S3 12.254 3 11.333c0-.706.882-2.29 1.294-2.99a.238.238 0 0 1 .412 0c.412.7 1.294 2.284 1.294 2.99M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5m-1.5-3A.5.5 0 0 1 10 3c1.162 0 2.35.584 2.947 1.776a.5.5 0 1 1-.894.448C11.649 4.416 10.838 4 10 4a.5.5 0 0 1-.5-.5M7 3.5a.5.5 0 0 0-.5-.5c-1.162 0-2.35.584-2.947 1.776a.5.5 0 1 0 .894.448C4.851 4.416 5.662 4 6.5 4a.5.5 0 0 0 .5-.5"/>*/}
        {/*                                        </svg>*/}
        {/*                                    </td>*/}
        {/*                                </tr>*/}
        {/*                            )}*/}
        {/*                            </tbody>*/}
        {/*                        </table>*/}
        {/*                    </div>*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*        </div>*/}

        {/*    )}*/}
        {/*    /!* 모달창의 끝  *!/*/}

        {/*    /!* 수정 모달창 *!/*/}
        {/*    {isModifyModalVisible && (*/}
        {/*        <div className="confirmRegist">*/}
        {/*            <div className="fullBody">*/}
        {/*                <div className="form-container">*/}
        {/*                    <button className="close-btn" onClick={handleModifyCloseClick}> &times;*/}
        {/*                    </button>*/}
        {/*                    <div className="form-header">*/}
        {/*                        <h1>고객 별 제품 판매가 수정</h1>*/}

        {/*                        <div className="btns">*/}
        {/*                            <div className="btn-add2">*/}
        {/*                                <button onClick={handleModifyBtn}> 수정하기</button>*/}
        {/*                            </div>*/}
        {/*                            <div className="btn-close">*/}

        {/*                            </div>*/}
        {/*                        </div>*/}
        {/*                    </div>*/}


        {/*                    <div className="RegistForm">*/}
        {/*                        <table className="formTable">*/}
        {/*                            <tr>*/}
        {/*                                <th colSpan="1"><label htmlFor="modifyProductNo">상품</label></th>*/}
        {/*                                <td colSpan="3">*/}
        {/*                                    <input name="productNo" className="filter-input" id="modifyProductNo"*/}
        {/*                                           placeholder="상품"*/}
        {/*                                           value={modifyItem.productName}*/}
        {/*                                           readOnly={true}/>*/}
        {/*                                </td>*/}

        {/*                                <th colSpan="1"><label htmlFor="modifyCustomerNo">고객</label></th>*/}
        {/*                                <td colSpan="3">*/}
        {/*                                    <input name="customerNo" className="filter-input" id="modifyCustomerNo"*/}
        {/*                                           placeholder="고객"*/}
        {/*                                           value={modifyItem.customerName}*/}
        {/*                                           readOnly={true}*/}
        {/*                                    />*/}
        {/*                                </td>*/}
        {/*                            </tr>*/}
        {/*                            <tr>*/}
        {/*                                <th><label htmlFor="modifyCustomPrice">가격</label></th>*/}
        {/*                                <td><input name="customPrice" type="number" placeholder="필드 입력"*/}
        {/*                                           id="modifyCustomPrice"*/}
        {/*                                           value={modifyItem.customPrice} onChange={(e) => {*/}
        {/*                                    handleModifyItemChange(e.target)*/}
        {/*                                }}/></td>*/}

        {/*                                <th><label htmlFor="modifyCurrency">통화</label></th>*/}
        {/*                                <td><input name="currency" type="text" placeholder="필드 입력" id="modifyCurrency"*/}
        {/*                                           value={modifyItem.currency} onChange={(e) => {*/}
        {/*                                    handleModifyItemChange(e.target)*/}
        {/*                                }}/></td>*/}

        {/*                                <th><label htmlFor="modifyDiscount">할인율(%)</label></th>*/}
        {/*                                <td><input name="discount" type="number" placeholder="필드 입력" id="modifyDiscount"*/}
        {/*                                           value={modifyItem.discount} onChange={(e) => {*/}
        {/*                                    handleModifyItemChange(e.target)*/}
        {/*                                }}/></td>*/}
        {/*                            </tr>*/}
        {/*                            <tr>*/}
        {/*                                <th colSpan="1"><label htmlFor="registStartDate">시작일</label></th>*/}
        {/*                                <td colSpan="3"><input name="startDate" type="date" placeholder="필드 입력"*/}
        {/*                                                       id="modifyStartDate"*/}
        {/*                                                       value={modifyItem.startDate} onChange={(e) => {*/}
        {/*                                    handleModifyItemChange(e.target)*/}
        {/*                                }}/>*/}
        {/*                                </td>*/}

        {/*                                <th colSpan="1"><label htmlFor="registStartDate">종료일</label></th>*/}
        {/*                                <td colSpan="3"><input name="startDate" type="date" placeholder="필드 입력"*/}
        {/*                                                       id="modifyEndDate"*/}
        {/*                                                       value={modifyItem.endDate} onChange={(e) => {*/}
        {/*                                    handleModifyItemChange(e.target)*/}
        {/*                                }}/></td>*/}
        {/*                            </tr>*/}
        {/*                        </table>*/}
        {/*                    </div>*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    )}*/}
        {/*    /!* 수정 모달창 끝  *!/*/}

        {/*    /!* 상세 모달창 *!/*/}
        {/*    {isVisibleDetail && (*/}

        {/*        <div className="confirmRegist">*/}
        {/*            <div className="fullBody">*/}
        {/*                <div className="form-container">*/}
        {/*                    <button className="close-btn" onClick={handleCloseClickDetail}> &times;*/}
        {/*                    </button>*/}


        {/*                    <ModalDetail title={modalDetailTitle} data={modalDetailData}/>*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    )}*/}


        </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Price/>
);