package com.project.tobe.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class MainController {

    @GetMapping("/{pageName}.do") // .do 해주세요
    public String page(@PathVariable String pageName) {
        System.out.println("뷰이름:" + pageName);

        return "layout"; // 언제나 view화면으로 이동합니다.
    }

    @GetMapping("/{pageName}.user")
    public String login(@PathVariable String pageName) {
        return "login";
    }

}