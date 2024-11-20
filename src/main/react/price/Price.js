import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchForm from './SearchForm';
import PriceTable from './PriceTable';
import AddPriceModal from './AddPriceModal';
import useSort from '../js/useSort';
import ModalDetail from "../js/ModalDetail";
import RenderPageNumbers from "../js/RenderPageNumbers";
import ReactDOM from "react-dom/client";

import './Price.css';
import '../js/modalAdd.css';
import '../js/Pagination.css';
import '../js/RenderPageNumbers.css';

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
        amount: 30,
        activated: 'Y'
    });

    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleDetail, setIsVisibleDetail] = useState(false);
    const [modalDetailTitle, setModalDetailTitle] = useState('');
    const [modalDetailData, setModalDetailData] = useState({});
    const { sortedData, sortData, sortConfig, getSortDirection } = useSort(price);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(100); // 총 아이템 수
    const [pageCount, setPageCount] = useState(10); // 총 페이지 수 계산

    useEffect(() => {
        fetchData();
        handleSearchBtn();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await axios('/price/all');
            setProduct(data.productList);
            setCustomer(data.customerList);
            setProductOptions(data.productList.map((item) => ({value: item.productNo, label: item.productName})));
            setCustomerOptions(data.customerList.map((item) => ({value: item.customerNo, label: item.customerName})));
        } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
        }
    };

    const handleSearchBtn = async () => {
        let copy = {...searchPrice, page: 1};
        await getSearchItems(copy);
    };

    const getSearchItems = async (item) => {
        console.log(item);

        let copy = Object.assign({}, item);

        if (copy.registerDate !== '') {
            copy = {...copy, registerDate: copy.registerDate + 'T00:00:00'};
        }

        const { data } = await axios.post('/price/search', copy, {
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
            },
        });

        console.log(data);

        setPrice(data.pageData);
        setCurrentPage(data.page);
        setTotalItems(data.total);
        setPageCount(data.realEnd);
        setSearchPrice((prev) => ({ ...prev, page: data.page }));
    };

    const handleAddClick = () => {
        setIsVisible(true);
        console.log(isVisible);
    };

    const handleCloseClick = () => {
        setIsVisible(false);
        getSearchItems(searchPrice);
    };

    const handlePageChange = async (selectedPage) => {
        console.log(selectedPage);
        let copy = {...searchPrice, page: selectedPage};
        console.log(copy);
        await getSearchItems(copy).then(r => console.log(r));
    };

    const handleAddClickDetail = (title, id) => {
        const data = title === 'product'
            ? product.find((item) => item.productNo === id)
            : customer.find((item) => item.customerNo === id);
        setModalDetailData(data);
        setModalDetailTitle(title);
        setIsVisibleDetail(true);
    };

    const handleCloseClickDetail = () => {
        setIsVisibleDetail(false);
    };

    const [productOptions, setProductOptions] = useState();

    const [customerOptions, setCustomerOptions] = useState();

    return (
        <div>
            <h1><i className="bi bi-currency-dollar"></i> 판매가 리스트 </h1>
            <SearchForm
                searchPrice={searchPrice}
                setSearchPrice={setSearchPrice}
                productOptions={productOptions}
                customerOptions={customerOptions}
                handleSearchBtn={handleSearchBtn}
                getSearchItems={getSearchItems}
            />
            <button className="btn-common add" type="button" onClick={handleAddClick}>
                판매가 등록
            </button>
            <PriceTable
                totalItems={totalItems}
                currentPage={currentPage}
                amount={searchPrice.amount}
                price={sortedData}
                handleAddClickDetail={handleAddClickDetail}
                sortData={sortData}
                getSortDirection={getSortDirection}
                sortConfig={sortConfig}
            />
            <RenderPageNumbers
                setCurrentPage={setCurrentPage}
                onPageChange={handlePageChange}
                totalPages={pageCount} // 총 페이지 수
                currentPage={currentPage} // 현재 페이지
            />

            <AddPriceModal
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                product={product}
                customer={customer}
                productOptions={productOptions}
                customerOptions={customerOptions}
                fetchData={fetchData}
                handleCloseClick={handleCloseClick}
            />
            {isVisibleDetail && (

                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClickDetail}> &times;
                            </button>
                            <ModalDetail title={modalDetailTitle} data={modalDetailData}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Price/>
);

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