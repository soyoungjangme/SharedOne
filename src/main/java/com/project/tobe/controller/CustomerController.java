package com.project.tobe.controller;

import com.project.tobe.customer.CustomerService;
import com.project.tobe.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //리액트용
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    @Qualifier("customerService") //주입받는 경로?
    private CustomerService customerService;

    // 고객 목록 불러오기
    @GetMapping("/customerList")
        public List<Customer> customerList() {

        System.out.println(customerService.getList());

        return customerService.getList();

        }



}
