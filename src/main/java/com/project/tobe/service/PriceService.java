package com.project.tobe.service;

import com.project.tobe.dto.PriceSearchDTO;
import com.project.tobe.entity.Price;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PriceService {
    List<Price> getAllPrice();
    List<Price> getPriceByDTO(PriceSearchDTO dto);


    ResponseEntity<String> savePrice(List<PriceSearchDTO> list);
}
