package com.project.tobe.controller;


import com.project.tobe.entity.Employee;
import com.project.tobe.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

  @Autowired
  private EmployeeRepository employeeRepository;


  @GetMapping("/employee")
  public List<Employee> getEmployee() {
//    System.out.println(employeeRepository.findById("hyeju11").orElse(null));
    return employeeRepository.findAll();
  }

  @GetMapping("/employeeF")
  public List<Employee> getListDesc() {
//    System.out.println(employeeRepository.findById("hyeju11").orElse(null));
    return employeeRepository.getListDesc();
  }


}
