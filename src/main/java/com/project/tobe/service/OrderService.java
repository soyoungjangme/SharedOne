package com.project.tobe.service;

import com.project.tobe.dto.OrderSearchDTO;
import com.project.tobe.entity.OrderH;

import java.util.List;
import java.util.Map;

public interface OrderService {

    List<OrderH> getOrder(OrderSearchDTO criteria); //조건조회
}
