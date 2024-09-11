package com.project.tobe.dto;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class PriceDTO {
    private Long priceNo;
    private LocalDate registerDate;
    private String productNo;
    private String customerNo;
    private Double customPrice;
    private String currency;
    private Double discount;
    private LocalDate startDate;
    private LocalDate endDate;
}
