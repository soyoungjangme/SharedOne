package com.project.tobe.service;

import com.project.tobe.dto.AuthorityDto;
import com.project.tobe.dto.EmployeeDTO;
import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.dto.EmployeeTestDTO;
import com.project.tobe.entity.Employee;
import com.project.tobe.security.EmployeeDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EmployeeService {
  Employee getUserById(String id);
  EmployeeDetails login(EmployeeDTO dto);
   List<EmployeeDTO> getAllList();
   List<EmployeeDTO> getPickList(EmployeeDTO dto);
   void employeeRegistTest( List<EmployeeTestDTO> dto);
   void employeeUpdateMaster(EmployeeTestDTO dto);
   void employeeDeleteTest(List<String> employeeIds);
   boolean employeeIdCheck(EmployeeDTO dto);
   void employeePwChange(EmployeeDTO dto);
   AuthorityDto mypageAll(String employeeId);
   void employeeDeletePick(String employeeId);
   void employeeUpdateMypage(EmployeeDTO dto);
   void employeeUpdateMypagePw(EmployeeDTO dto);
   EmployeeDTO employeeUserSession(String id);

    List<EmployeeDTO> getManagerList(String id);
}
