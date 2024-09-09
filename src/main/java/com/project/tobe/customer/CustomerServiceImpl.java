package com.project.tobe.customer;

import com.project.tobe.entity.CustomerVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

//이름 어노 넣기
@Service("customerService")
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerMapper customerMapper; //매퍼와 연결하기


    @Override
    public List<CustomerVO> getList(Criteria criteria) {
        return customerMapper.getList(criteria);
    }

    @Override
    public void addList(CustomerVO customerVO) {

    }



}
