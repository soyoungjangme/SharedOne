package com.project.tobe.service;

import com.project.tobe.dto.CustomerSearchDTO;
import com.project.tobe.dto.CustomerDTO;
import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.dto.EmployeeTestDTO;
import com.project.tobe.entity.Customer;
import com.project.tobe.entity.Employee;

import java.util.List;

public interface EmployeeService {

  public List<Employee> getAllList();
  public List<Employee> getPickList(EmployeeSearchDTO dto);
  public void employeeRegistTest( List<EmployeeTestDTO> dto);
  public void employeeUpdateTest(EmployeeTestDTO dto);
  public void employeeDeleteTest(List<String> employeeIds);
}
