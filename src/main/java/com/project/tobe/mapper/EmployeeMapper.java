package com.project.tobe.mapper;

import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.dto.EmployeeTestDTO;
import com.project.tobe.entity.Employee;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmployeeMapper {

  public List<Employee> getAllList();
  public List<Employee> getPickList(EmployeeSearchDTO dto);
  public void employeeRegistTest( List<EmployeeTestDTO> dto);
  public void employeeUpdateTest(EmployeeTestDTO dto);
  public void employeeDeleteTest(List<String> employeeIds);
}
