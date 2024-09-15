package com.project.tobe.serviceImpl;

import com.project.tobe.dto.OrderHDTO;
import com.project.tobe.dto.OrderSearchDTO;
import com.project.tobe.dto.PriceDTO;
import com.project.tobe.mapper.OrderMapper;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("orderService")
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public List<OrderHDTO> getOrder(OrderSearchDTO criteria) {
        System.out.println("orderList서비스 실행됨");
        return orderMapper.getOrder(criteria);
    }

    @Override
    public List<PriceDTO> getPrice(Integer iocn) {
        System.out.println("getPrice서비스 실행됨");
        return orderMapper.getPrice(iocn);
    }

    /*상세 보기 - 유선화 START*/
    @Override
    public OrderHDTO getOrderDetail(Long orderNo) {
        return orderMapper.getOrderDetail(orderNo);
    }
    /*상세 보기 - 유선화 END*/
}
