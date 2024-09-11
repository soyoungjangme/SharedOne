package com.project.tobe.service;

import com.project.tobe.dto.CustomerSearchDTO;
import com.project.tobe.dto.CustomerDTO;
import com.project.tobe.entity.Customer;

import java.util.List;

public interface EmployeeService {

  public List<Customer> getAllList();
  public List<Customer> getPickList(CustomerSearchDTO dto);
  public void employeeRegistTest( List<CustomerDTO> dto);
  public void employeeUpdateTest(CustomerDTO dto);
  public void employeeDeleteTest(List<String> employeeIds);
}
