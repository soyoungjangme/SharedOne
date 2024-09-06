package com.project.tobe.dto;

import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDate;

@Getter
@Setter
@ToString
@AllArgsConstructor
@Builder
public class PriceSearchDTO {
    private Timestamp registerDate;
    private String productNo;
    private String customerNo;
    private LocalDate startDate;
    private LocalDate endDate;
}
