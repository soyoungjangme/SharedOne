package com.project.tobe.service;

import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.dto.EmployeeDTO;
import com.project.tobe.entity.Employee;

import java.util.List;

public interface EmployeeService {

  public List<Employee> getAllList();
  public List<Employee> getPickList(EmployeeSearchDTO dto);
  public void employeeRegistTest( List<EmployeeDTO> dto);
  public void employeeUpdateTest(EmployeeDTO dto);
  public void employeeDeleteTest(List<String> employeeIds);
}
