package com.project.tobe.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDate;

@Entity
@Table(name = "price")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(
        name = "seqPrice",
        sequenceName = "seq_price",
        initialValue = 1,
        allocationSize = 1
)
public class Price {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqPrice")
    private Long priceNo;
    private Timestamp registerDate;
    private Long productNo;
    private Long customerNo;
    private Double price;
    private String currency;
    private Double discount;
    private LocalDate startDate;
    private LocalDate endDate;

    public Price(
            Timestamp registerDate,
            Long productNo, Long customerNo,
            Double price,
            String currency,
            Double discount,
            LocalDate startDate,
            LocalDate endDate
    ) {
        this.registerDate = registerDate;
        this.productNo = productNo;
        this.customerNo = customerNo;
        this.price = price;
        this.currency = currency;
        this.discount = discount;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
