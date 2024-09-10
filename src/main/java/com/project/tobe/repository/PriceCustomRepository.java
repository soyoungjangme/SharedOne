package com.project.tobe.repository;

import com.project.tobe.dto.PriceProductCustomerDTO;
import com.project.tobe.dto.PriceSearchDTO;
import com.project.tobe.entity.Price;

import java.util.List;

public interface PriceCustomRepository {
    List<Price> getPriceByDTO(PriceSearchDTO dto);
    List<PriceProductCustomerDTO> getPriceJoinByDTO(PriceSearchDTO dto);
}
