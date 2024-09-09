package com.project.tobe.mapper;

import com.project.tobe.entity.OrderH;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderMapper {

    List<OrderH> getOrder(); //주문리스트

}
