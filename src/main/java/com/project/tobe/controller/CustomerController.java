package com.project.tobe.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class CustomerController {

    @GetMapping("/{pageName}.mo") //
    public String page(@PathVariable String pageName, Model model) {
        model.addAttribute("pageName", pageName);
        System.out.println("view 이름 : " + pageName);
        return "test"; // test.html로
    }

}
