package com.project.tobe.controller;


import com.project.tobe.dto.*;
import com.project.tobe.dto.EmployeeDTO;
import com.project.tobe.entity.Employee;
import com.project.tobe.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

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
    public List<EmployeeDTO> employeeALL() {
      List<EmployeeDTO> emploList = employeeService.getAllList();
      return employeeService.getAllList();
    }

  @PostMapping("/employeeSearch")
  public List<EmployeeDTO> employeePick(@RequestBody EmployeeSearchDTO dto) {
    return employeeService.getPickList(dto);
  }


  @PostMapping("/employeeRegist")
  public void employeeRegistTest(@RequestBody List<EmployeeTestDTO> dto) {
    employeeService.employeeRegistTest(dto);
  }


  @PostMapping("/employeeIdCheck")
  public boolean employeeIdCheck(@RequestBody EmployeeDTO dto) {
    return employeeService.employeeIdCheck(dto);
  }

  @PostMapping("/employeeUpdate")
  public void employeeUpdateMaster(@RequestBody EmployeeTestDTO dto) {
    employeeService.employeeUpdateMaster(dto);
  }

  @PostMapping("/employeeDelete")
  public void employeeDeleteTest(@RequestBody List<String> employeeIds) {
    employeeService.employeeDeleteTest(employeeIds);
  }

  @PostMapping("/employeeDeletePick")
  public void employeeDeletePick(@RequestBody String employeeId) {
    System.out.println("컨");
    employeeService.employeeDeletePick(employeeId);
  }


  @PostMapping("/employeePwChange")
  public void employeePwChange(@RequestBody EmployeeDTO dto) {
    employeeService.employeePwChange(dto);
  }



}
