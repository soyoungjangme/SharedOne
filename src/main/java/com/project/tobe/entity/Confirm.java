
package com.project.tobe.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Entity
@Table (name = "confirm")
public class Confirm {
    @Id
    private int confirmNo;
    private String confirmStatus;
    private String confirmTitle;
    private String confirmContent;
    private LocalDate confirmRegDate;
    private LocalDate confirmConfirmDate;
    private String employeeId;
    private int orderNo;
}