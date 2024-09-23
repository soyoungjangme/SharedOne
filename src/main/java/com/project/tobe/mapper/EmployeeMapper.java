package com.project.tobe.mapper;

import com.project.tobe.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EmployeeMapper {

   List<EmployeeDTO> getAllList();
   List<EmployeeDTO> getPickList(EmployeeDTO dto);
   int getPickListTotal(EmployeeDTO dto);
   void employeeRegistTest( List<EmployeeTestDTO> dto);
   void employeeUpdateMaster(EmployeeTestDTO dto);
   void employeeUpdateUser(EmployeeTestDTO dto);
   void employeeDeleteTest(List<String> employeeIds);
   int employeeIdCheck(EmployeeDTO dto);
   AuthorityDto mypageAll(String employeeId);
   void employeePwChange(EmployeeDTO dto);
   AuthorityDto sessionAuth(String id);
   void employeeDeletePick(String employeeId);
   void employeeUpdateMypage(EmployeeDTO dto);
   void employeeUpdateMypagePw(EmployeeDTO dto);
   EmployeeDTO employeeUserSession(String id);
    List<EmployeeDTO> getManagerList(String id);

    SalesByMonth getMySalesByMonth(String employeeId);
}

