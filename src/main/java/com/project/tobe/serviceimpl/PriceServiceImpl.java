package com.project.tobe.serviceimpl;

import com.project.tobe.dto.PriceSearchDTO;
import com.project.tobe.entity.Price;
import com.project.tobe.repository.PriceRepository;
import com.project.tobe.service.PriceService;
import com.project.tobe.util.constants.YesNo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PriceServiceImpl implements PriceService {
    @Autowired
    private PriceRepository priceRepository;

    @Override
    public List<Price> getAllPrice() {
        return priceRepository.findByActivatedEquals(YesNo.Y);
    }

    @Override
    public List<Price> getPriceByDTO(PriceSearchDTO dto) {
        return priceRepository.getPriceByDTO(dto);
    }

    @Override
    public ResponseEntity<String> savePrice(List<PriceSearchDTO> list) {
        for (PriceSearchDTO dto : list) {
            Price price = Price.builder()
                    .registerDate(LocalDate.now())
                    .productNo(Long.valueOf(dto.getProductNo()))
                    .customerNo(Long.valueOf(dto.getCustomerNo()))
                    .customPrice(Double.valueOf(dto.getCustomPrice()))
                    .currency(dto.getCurrency())
                    .discount(dto.getDiscount())
                    .startDate(dto.getStartDate())
                    .endDate(dto.getEndDate())
                    .activated(YesNo.Y)
                    .build();

            priceRepository.save(price);
        }

        return ResponseEntity.ok().build();
    }
}
