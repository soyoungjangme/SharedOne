package com.project.tobe.serviceimpl;


import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.dto.EmployeeDTO;
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
    return employeeMapper.getAllList();

  }

  @Override
  public List<Employee> getPickList(EmployeeSearchDTO dto) {
    System.out.println("서비스");
    System.out.println("작동됨 picList" + employeeMapper.getPickList(dto));
    return employeeMapper.getPickList(dto);
  }

  @Override
  public void employeeRegistTest( List<EmployeeDTO> dto) {
    System.out.println("서비스");
    employeeMapper.employeeRegistTest(dto);
  }

  @Override
  public void employeeUpdateTest(EmployeeDTO dto) {
    System.out.println("서비스");
    employeeMapper.employeeUpdateTest(dto);
  }


  @Override
  public void employeeDeleteTest(List<String> employeeIds) {
    System.out.println("서비스");
    employeeMapper.employeeDeleteTest(employeeIds);
  }


}
