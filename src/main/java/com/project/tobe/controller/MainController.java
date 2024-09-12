package com.project.tobe.controller;

import com.project.tobe.entity.Employee;
import com.project.tobe.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import javax.validation.Valid;

@Controller
public class MainController {

    @Autowired
    @Qualifier("employeeService")
    private EmployeeService employeeService;

    @GetMapping("/{pageName}.do") // .do 해주세요
    public String page(@PathVariable String pageName) {
        System.out.println("뷰이름:" + pageName);
        return "layout"; //언제나 view화면으로 이동합니다.
    }

    @GetMapping("/{pageName}.user")
    public String login(@PathVariable String pageName) {
        return "login";
    }

//    @PostMapping("/loginForm")
//    public String loginValidate(Authentication auth) {
//        System.out.println("login -------");
//
//        System.out.println(auth.toString());
//
//        Employee employee = employeeService.getUserById(auth.getName());
//
//        if (employee == null) {
//            return "redirect:/login.user";
//        }
//
//        return "redirect:/main.do";
//    }
}