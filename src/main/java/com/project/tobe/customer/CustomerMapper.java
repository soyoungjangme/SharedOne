package com.project.tobe.customer;

import com.project.tobe.entity.Customer;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper //매퍼 추가~~~~~
public interface CustomerMapper {

    List<Customer> getList();


}
