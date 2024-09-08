package com.project.tobe.controller;

import com.project.tobe.entity.Customer;
import com.project.tobe.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.tobe.entity.TestDB;
import com.project.tobe.repository.TestRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Customer_test")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/customer")
    public Customer getData() {
        return customerRepository.findById(1L).orElse(null);
    }

    //

}
