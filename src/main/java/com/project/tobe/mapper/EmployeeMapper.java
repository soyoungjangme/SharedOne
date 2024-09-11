package com.project.tobe.mapper;

import com.project.tobe.dto.CustomerSearchDTO;
import com.project.tobe.dto.CustomerDTO;
import com.project.tobe.entity.Customer;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EmployeeMapper {

  public List<Customer> getAllList();
  public List<Customer> getPickList(CustomerSearchDTO dto);
  public void employeeRegistTest( List<CustomerDTO> dto);
  public void employeeUpdateTest(CustomerDTO dto);
  public void employeeDeleteTest(List<String> employeeIds);
}

