package com.project.tobe.serviceimpl;


import com.project.tobe.dto.EmployeeDTO;
import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.dto.EmployeeTestDTO;
import com.project.tobe.entity.Employee;
import com.project.tobe.mapper.EmployeeMapper;
import com.project.tobe.repository.EmployeeRepository;
import com.project.tobe.security.EmployeeDetails;
import com.project.tobe.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service("employeeService")
public class EmployeeServiceImpl implements EmployeeService {

  @Autowired
  EmployeeMapper employeeMapper;

  @Autowired
  EmployeeRepository repository;

  @Autowired
  BCryptPasswordEncoder bCryptPasswordEncoder;

  @Override
  public Employee getUserById(String id) {
    if (id == null) {
      return null;
    }

    Optional<Employee> employee = repository.findById(id);

    return employee.orElse(null);
  }

  @Override
  public EmployeeDetails login(EmployeeDTO dto) {
    if (dto == null) {
      return null;
    }

    Optional<Employee> employee = repository.findById(dto.getEmployeeId());

    if (employee.isEmpty()) {
      return null;
    }

    if (!employee.get().getEmployeePw().equals(dto.getEmployeePw())) {
      return null;
    }

    return new EmployeeDetails(employee.orElse(null));
  }

  @Override
  public List<EmployeeDTO> getAllList() {
    return employeeMapper.getAllList();

  }

  @Override
  public List<EmployeeDTO> getPickList(EmployeeSearchDTO dto) {
    System.out.println("서비스");
    System.out.println("작동됨 picList" + employeeMapper.getPickList(dto));
    return employeeMapper.getPickList(dto);
  }

  @Override
  public void employeeRegistTest( List<EmployeeTestDTO> dto) {
    System.out.println("서비스");



    List<EmployeeTestDTO> list = new LinkedList<>();

    for (EmployeeTestDTO employee : dto) {
      employee.setEmployeePw(bCryptPasswordEncoder.encode(employee.getEmployeePw()));
      list.add(employee);
    }

    employeeMapper.employeeRegistTest(list);
  }

  @Override
  public void employeeUpdateTest(EmployeeTestDTO dto) {
    System.out.println("서비스");
    employeeMapper.employeeUpdateTest(dto);
  }


  @Override
  public void employeeDeleteTest(List<String> employeeIds) {
    System.out.println("서비스");
    employeeMapper.employeeDeleteTest(employeeIds);
  }


}
