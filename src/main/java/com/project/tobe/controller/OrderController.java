package com.project.tobe.controller;

import com.project.tobe.dto.OrderSearchDTO;
import com.project.tobe.entity.OrderH;
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
        return orderService.getOrder(null);
    }

//    //조건 별 조회(상품명)
//    @PostMapping("/searchSelect")
//    public List<OrderH> orderList(@RequestBody Map<String , String> request){ //@RequestBody:본문내용(JSON, XML)을 Java객체로 자동변환
//        String  inputProdNo = request.get("inputProdNo");
//        System.out.println("inputProdNo");
//
//        List<OrderH> orders = orderService.getOrder(inputProdNo);
//        return orders;
//    }

    @PostMapping("/searchSelect")
    public ResponseEntity<List<OrderH>> searchOrderList(@RequestBody OrderSearchDTO criteria) {
        List<OrderH> orders = orderService.getOrder(criteria);
        return ResponseEntity.ok(orders);
    }

}
