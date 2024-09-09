package com.project.tobe.customer;

import com.project.tobe.entity.CustomerVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper //매퍼 추가~~~~~
public interface CustomerMapper {

    //리스트 조회하기
    List<CustomerVO> getList(Criteria criteria);

    //고객 추가하기
    public void customerInsert(CustomerVO customerVO);


}
