package com.project.tobe.controller;

import com.project.tobe.customer.Criteria;
import com.project.tobe.customer.CustomerService;
import com.project.tobe.entity.CustomerVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.List;

@RestController //리액트용
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    @Qualifier("customerService") //주입받는 경로?
    private CustomerService customerService;

    // 고객 목록 불러오기
    @GetMapping("/customer.do")
    public String customerList(Model model, Criteria cri, HttpSession httpSession) {

        // 고객 목록을 가져옵니다.
        List<CustomerVO> customerList = customerService.getList(cri);
        // 모델에 고객 목록을 추가합니다.
        model.addAttribute("customerList", customerList);
        // 뷰 이름을 반환합니다.
        return "customer/customerList";

    }

}
