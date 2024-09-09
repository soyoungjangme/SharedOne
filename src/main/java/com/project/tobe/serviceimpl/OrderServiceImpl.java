package com.project.tobe.serviceimpl;

import com.project.tobe.entity.OrderH;
import com.project.tobe.mapper.OrderMapper;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("orderservice")
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;


    @Override
    public List<OrderH> getOrder() {
        List<OrderH> order = orderMapper.getOrder();
        System.out.println(order.toString());
        return order;

    }
}
