package com.project.tobe.mapper;

import com.project.tobe.dto.OrderH;
import com.project.tobe.dto.OrderSearchDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderMapper {
    List<OrderH> getOrder(OrderSearchDTO criteria); //조건조회

}
