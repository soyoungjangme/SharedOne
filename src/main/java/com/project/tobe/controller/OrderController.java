package com.project.tobe.controller;

import com.project.tobe.entity.OrderH;
import com.project.tobe.order.OrderService;
import com.project.tobe.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    @Qualifier("orderservice")
    private OrderService orderService;

    @GetMapping("/get")
    public OrderH get(){

        return orderRepository.findById(10).orElse(null);
    }

    @PostMapping("/insert")
    public void insert(@RequestBody OrderH vo){
        System.out.println(vo.toString());
        orderService.insert(vo);
    }


}
