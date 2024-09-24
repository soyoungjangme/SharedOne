import React, {useEffect, useRef, useState} from 'react';
import Select from "react-select";

const SearchForm = ({ searchPrice, setSearchPrice, productOptions, customerOptions, handleSearchBtn, getSearchItems }) => {
    console.log(typeof getSearchItems);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const isFirstRender = useRef(true); // 처음 렌더링인지 확인하기 위한 ref

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchPrice((prev) => ({ ...prev, [name]: value }));
    };

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleSearchBtn();
        }
    }

    const handleSearchPriceChange = (name, item) => {
        if (name === 'productNo') setSelectedProduct(item);
        if (name === 'customerNo') setSelectedCustomer(item);

        console.log(selectedProduct);
        setSearchPrice((prev) => ({...prev, [name]: item.value}));
    }

    const handleSearchResetBtn = () => {
        setSelectedProduct(null);
        setSelectedCustomer(null);

        const resetData = {
            registerDate: '',
            productNo: '',
            customerNo: '',
            startDate: '',
            endDate: '',
            page: 1,
            amount: 30,
        };
        setSearchPrice(resetData);
        getSearchItems(resetData);
    }

    // useEffect(() => {
    //     if (isFirstRender.current) {
    //         // 첫 렌더링일 때는 실행하지 않음
    //         isFirstRender.current = false;
    //     } else {
    //         // 상태 변경이 완료된 후에만 실행
    //         handleSearchBtn();
    //     }
    // }, [searchPrice]);

    return (
        <div className="main-container">
            <div className="filter-containers">
                <div className="filter-container">
                    <div className="filter-items">
                        {/* Product Filter */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="product">상품</label>
                            <Select
                                value={selectedProduct}
                                className="filter-input"
                                name="productNo"
                                options={productOptions}
                                placeholder="상품 선택"
                                onChange={(option) => {handleSearchPriceChange('productNo', option)}}
                            />
                        </div>

                        {/* Customer Filter */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="customer">업체</label>
                            <Select
                                value={selectedCustomer}
                                className="filter-input"
                                name="customerNo"
                                options={customerOptions}
                                placeholder="고객 선택"
                                onChange={(option) => handleSearchPriceChange('customerNo', option)}
                            />
                        </div>

                        {/* Date Filters */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="registerDate">등록일자</label>
                            <input
                                name="registerDate"
                                className="filter-input"
                                type="date"
                                id="registerDate"
                                value={searchPrice.registerDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="filter-item">
                            <label className="filter-label" htmlFor="startDate">시작일자</label>
                            <input
                                name="startDate"
                                className="filter-input"
                                type="date"
                                id="startDate"
                                value={searchPrice.startDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="filter-item">
                            <label className="filter-label" htmlFor="endDate">종료일자</label>
                            <input
                                name="endDate"
                                className="filter-input"
                                type="date"
                                id="endDate"
                                value={searchPrice.endDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="button-container">
                    <button type="button" className="reset-btn" onClick={handleSearchResetBtn}>
                        <i className="bi bi-arrow-clockwise"></i>
                    </button>
                    <button type="button" className="search-btn" onClick={handleSearchBtn}>
                        <i className="bi bi-search search-icon"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchForm;
