package com.project.tobe.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class EmployeeRankDTO {
    private String employeeId;
    private String employeeName;
    private String monthlySales;
}
