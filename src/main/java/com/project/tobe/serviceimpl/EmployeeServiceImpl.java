package com.project.tobe.serviceimpl;


import com.project.tobe.dto.CustomerSearchDTO;
import com.project.tobe.dto.CustomerDTO;
import com.project.tobe.entity.Customer;
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
  public List<Customer> getAllList() {
    return employeeMapper.getAllList();

  }

  @Override
  public List<Customer> getPickList(CustomerSearchDTO dto) {
    System.out.println("서비스");
    System.out.println("작동됨 picList" + employeeMapper.getPickList(dto));
    return employeeMapper.getPickList(dto);
  }

  @Override
  public void employeeRegistTest( List<CustomerDTO> dto) {
    System.out.println("서비스");
    employeeMapper.employeeRegistTest(dto);
  }

  @Override
  public void employeeUpdateTest(CustomerDTO dto) {
    System.out.println("서비스");
    employeeMapper.employeeUpdateTest(dto);
  }


  @Override
  public void employeeDeleteTest(List<String> employeeIds) {
    System.out.println("서비스");
    employeeMapper.employeeDeleteTest(employeeIds);
  }


}
