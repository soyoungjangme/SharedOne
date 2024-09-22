import React from 'react';
import Select from "react-select";

const SearchForm = ({ searchPrice, setSearchPrice, productOptions, customerOptions, handleSearchBtn, handleSearchResetBtn }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchPrice((prev) => ({ ...prev, [name]: value }));
    };

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleSearchBtn();
        }
    }

    const handleSearchPriceChange = (name, value) => {
        setSearchPrice((prev) => ({...prev, productNo: value}));
    }

    return (
        <div className="main-container">
            <div className="filter-containers">
                <div className="filter-container">
                    <div className="filter-items">
                        {/* Product Filter */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="product">상품</label>
                            <Select
                                name="productNo"
                                options={productOptions}
                                placeholder="상품 선택"
                                onChange={(option) => {handleSearchPriceChange('productNo', option.value)}}
                            />
                        </div>

                        {/* Customer Filter */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="customer">업체</label>
                            <Select
                                name="customerNo"
                                options={customerOptions}
                                placeholder="고객 선택"
                                onChange={(option) => handleSearchPriceChange('customerNo', option.value)}
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
                    <button type="button" className="search-btn" onClick={handleSearchBtn}>
                        <i className="bi bi-search search-icon"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchForm;
