// Pagination.js
import React from "react";
import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import './Pagination.css';

const Pagination = ({ pageCount, onPageChange, currentPage, total }) => {
    return (
        <ReactPaginate
            previousLabel={<FiChevronLeft />}
            nextLabel={<FiChevronRight />}
            activePage={currentPage}
            pageCount={pageCount}
            onPageChange={onPageChange}
            totalItemsCount={total}
            containerClassName={"pagination"}
            pageLinkClassName={"pagination__link"}
            activeLinkClassName={"pagination__link__active"}
        />
    );
};

export default Pagination;