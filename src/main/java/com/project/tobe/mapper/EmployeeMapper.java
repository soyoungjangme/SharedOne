package com.project.tobe.mapper;

import com.project.tobe.entity.Employee;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EmployeeMapper {

  List<Employee> getAllList();

}
