package com.project.tobe.controller;

import com.project.tobe.entity.OrderH;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    @Qualifier("orderservice")
    private OrderService orderService;


    @GetMapping("/orderList")
    public List<OrderH> getOrder(){
        System.out.println("getOrder실행됨");
        return orderService.getOrder();
    }

}
