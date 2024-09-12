package com.project.tobe.controller;

import com.project.tobe.dto.OrderH;
import com.project.tobe.dto.OrderSearchDTO;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    @Qualifier("orderservice")
    private OrderService orderService;

    //초기 목록 호출
    @GetMapping("/orderList")
    public List<OrderH> orderList (){
        System.out.println("orderList실행됨.");
        return orderService.getOrder(null);
    }

    @PostMapping("/searchSelect")
    public ResponseEntity<List<OrderH>> searchOrderList(@RequestBody OrderSearchDTO criteria) {
        List<OrderH> orders = orderService.getOrder(criteria);
        return ResponseEntity.ok(orders);
    }

}
