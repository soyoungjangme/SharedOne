package com.project.tobe.order;

import com.project.tobe.entity.OrderH;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("orderservice")
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public void insert(OrderH vo) {
        orderMapper.insert(vo);
    }
}
