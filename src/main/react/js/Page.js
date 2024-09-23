import {useState} from "react";
import {Link} from "react-router-dom";


function Page() {
    let [page, setPage] = useState(1);
    let [amount, setAmount] = useState(10);

    let [pageStart, setPageStart] = useState(0);
    let [pageEnd, setPageEnd] = useState(0);

    let [pageBody, setPageBody] = useState([]);

    const createPage =  (item, func) => {
        let next = item.next;
        let prev = item.prev;
        let pageList = item.pageList;
        setPageStart(item.start);
        setPageEnd(item.end);

        const pages = [];

        // 이전 버튼 추가 (첫 번째 페이지에서 비활성화)
        if (prev) {
            pages.push(
                <p className="prev" key="prev" onClick={prev ? func : null}>
                    <strong>{'<'}</strong>
                </p>
            );
        } else {
            pages.push(
                <p className="prev disabled" key="prev">
                    <strong>{'<'}</strong>
                </p>
            );
        }

        // 페이지 번호 추가
        for (let i = 0; i < pageList.length; i++) {
            pages.push(
                <p className={`number ${page === pageList[i] ? 'active' : ''}`} key={i} onClick={() => setPage(pageList[i])}>
                    <strong>{pageList[i]}</strong>
                </p>
            )
        }

        // 다음 버튼 추가 (마지막 페이지에서 비활성화)
        if (next) {
            pages.push(
                <p className="next" key="next" onClick={next ? func : null}>
                    <strong>{'>'}</strong>
                </p>
            );
        } else {
            pages.push(
                <p className="next disabled" key="next">
                    <strong>{'>'}</strong>
                </p>
            );
        }

        // 페이지 요소를 상태로 설정
        setPageBody(pages);
    }

    const pageClick = (e) => {
        let tagName = e.target.tagName;
        if (tagName !== 'P') {
            return;
        }

        let className = e.target.className;
        if (className === 'prev') {
            setPage(pageStart - 1);
        }

        if (className === 'next') {
            setPage(pageStart + 1);
        }

        if (className === 'number') {
            setPage(parseInt(e.target.firstChild.innerHTML));
        }
    };

    return {
        page,
        setPage,
        amount,
        setAmount,
        pageStart,
        setPageStart,
        pageEnd,
        setPageEnd,
        pageBody,
        createPage,
        pageClick,
    }
}

export default Page;
