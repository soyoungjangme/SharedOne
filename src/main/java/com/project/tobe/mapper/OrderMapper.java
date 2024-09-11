package com.project.tobe.mapper;

import com.project.tobe.dto.OrderSearchDTO;
import com.project.tobe.entity.OrderH;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface OrderMapper {
    List<OrderH> getOrder(OrderSearchDTO criteria); //조건조회

}
