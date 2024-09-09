package com.project.tobe.controller;

import com.project.tobe.entity.CustomerVO;
import com.project.tobe.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Customer")
public class CustomerController_test {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/customer")
    public CustomerVO getData() {
        return customerRepository.findById(1L).orElse(null);
    }

    //

}
