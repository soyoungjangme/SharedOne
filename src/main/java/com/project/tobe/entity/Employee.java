package com.project.tobe.entity;

import lombok.*;

<<<<<<< HEAD
import javax.persistence.*;
import java.util.Date;
import java.util.List;
=======
import java.time.LocalDate;
>>>>>>> main

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
<<<<<<< HEAD
    private Date hireDate;
=======
    private String residentNum;
    private LocalDate hireDate;
>>>>>>> main
    private Long salary;
    private String employeeManagerId;
    private String authorityGrade;
}
