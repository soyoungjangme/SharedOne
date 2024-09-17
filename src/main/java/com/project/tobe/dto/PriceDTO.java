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

    // OrderMapper에서 getPrice 돌리려면 필요하다고 함
    private ProductDTO product;

    private int page = 1;
    private int amount = 10;

    public PriceDTO(String productNo, String customerNo, Double customPrice, String currency, Double discount, LocalDate startDate, LocalDate endDate) {
        this.productNo = productNo;
        this.customerNo = customerNo;
        this.customPrice = customPrice;
        this.currency = currency;
        this.discount = discount;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public PriceDTO(LocalDate registerDate, String productNo, String customerNo, Double customPrice, String currency, Double discount, LocalDate startDate, LocalDate endDate, int page, int amount) {
        this.registerDate = registerDate;
        this.productNo = productNo;
        this.customerNo = customerNo;
        this.customPrice = customPrice;
        this.currency = currency;
        this.discount = discount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.page = page;
        this.amount = amount;
    }

    // offset - limit 함수에 앞에 전달될 값
    public int getPageStart() {
        return (page - 1) * amount;
    }
}
