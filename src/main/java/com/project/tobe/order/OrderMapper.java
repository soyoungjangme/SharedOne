package com.project.tobe.order;

import com.project.tobe.entity.OrderH;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderMapper {

    void insert(OrderH vo);

}
