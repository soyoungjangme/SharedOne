package com.project.tobe.controller;


import com.project.tobe.entity.Employee;
import com.project.tobe.repository.EmployeeRepository;
import com.project.tobe.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

//  @Autowired
//  private EmployeeRepository employeeRepository;

  @Autowired
  @Qualifier("employeeService")
  private EmployeeService employeeService;

//    @GetMapping("/employeeOne")
//    public Employee employeeOne() {
//        Employee e = new Employee("hyeju11"	,"asdf1234",	"임혜주",	"010-1111-1111"	,"asdf@gamil.com"	,"서울"	,"11111-1111111" , LocalDate.parse("2020-01-01", DateTimeFormatter.ISO_LOCAL_DATE),	(long)120000	,"master",	"S");
//        return e;
//        }

    @GetMapping("/employeeALL")
    public List<Employee> employeeALL() {
      List<Employee> emploList = employeeService.getAllList();
      System.out.println("직원 리스트 " + emploList.toString());
      System.out.println("작동됨 1");
      return employeeService.getAllList();
    }



}
