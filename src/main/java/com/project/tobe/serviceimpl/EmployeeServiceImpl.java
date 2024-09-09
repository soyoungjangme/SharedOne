package com.project.tobe.serviceimpl;


import com.project.tobe.entity.Employee;
import com.project.tobe.mapper.EmployeeMapper;
import com.project.tobe.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("employeeService")
public class EmployeeServiceImpl implements EmployeeService {

  @Autowired
  EmployeeMapper employeeMapper;

  @Override
  public List<Employee> getAllList() {
    System.out.println("작동됨 2");
    System.out.println(" 리스트 " + employeeMapper.getAllList());
    return employeeMapper.getAllList();

  }
}
