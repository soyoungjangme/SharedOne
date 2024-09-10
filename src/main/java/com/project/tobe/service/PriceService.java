package com.project.tobe.service;

import com.project.tobe.dto.PriceProductCustomerDTO;
import com.project.tobe.dto.PriceDTO;
import com.project.tobe.entity.Price;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PriceService {
    List<Price> getAllPrice();
    List<Price> getPriceByDTO(PriceDTO dto);
    List<PriceProductCustomerDTO> getPriceProductCustomerDTO(PriceDTO dto);


    ResponseEntity<String> savePrice(List<PriceDTO> list);

    ResponseEntity<String> updatePrice(PriceDTO dto);
}
