package com.project.tobe.entity;

import lombok.*;

import java.time.LocalDate;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Employee {
    private String employeeId;
    private String employeePw;
    private String employeeName;
    private String employeeTel;
    private String employeeEmail;
    private String employeeAddr;
    private String residentNum;
    private LocalDate hireDate;
    private Long salary;
    private String employeeManagerId;
    private String authorityGrade;
}
