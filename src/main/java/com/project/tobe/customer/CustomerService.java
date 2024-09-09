package com.project.tobe.customer;

import com.project.tobe.entity.CustomerVO;

import java.util.List;

public interface CustomerService {

    //리스트 조회하기
    List<CustomerVO> getList(Criteria criteria);
    
    //고객 추가하기
    public void addList(CustomerVO customerVO);

}
