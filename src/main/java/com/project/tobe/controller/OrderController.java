package com.project.tobe.controller;

import com.project.tobe.dto.*;
import com.project.tobe.entity.OrderH;
import com.project.tobe.security.EmployeeDetails;
import com.project.tobe.service.EmployeeService;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    @Qualifier("orderService")
    private OrderService orderService;

    @Autowired
    @Qualifier("employeeService")
    private EmployeeService employeeService;

    //jsy초기 목록 호출
    @GetMapping("/orderList")
    public List<OrderHDTO> orderList (){
        return orderService.getOrder(null);
    }

    //jsy주문 조건 별 조회
    @PostMapping("/searchSelect")
    public ResponseEntity<List<OrderHDTO>> searchOrderList(@RequestBody OrderSearchDTO criteria) {
        List<OrderHDTO> orders = orderService.getOrder(criteria);
        return ResponseEntity.ok(orders);
    }

    //jsy주문등록 - 고객 별 판매가
    @PostMapping("/getPrice")
    public ResponseEntity<List<PriceDTO>> getPrice(@RequestBody Map<String, String> request){
        String inputOrderCustomerNo = request.get("inputOrderCustomerNo"); //문자열로 단일객체 받아서
        String delDate = request.get("inputOrderDelDate");

        List<PriceDTO> customPrice;


        if( inputOrderCustomerNo == null || inputOrderCustomerNo.isEmpty() ){ //고객명 선택x
            customPrice = new ArrayList<>(); //빈 리스ㅡㅌ 반환

        }else { //고객명 데이터 들어있으면
            Integer iocn = Integer.parseInt(inputOrderCustomerNo); //데이터 정수변환
            customPrice = orderService.getPrice(iocn, delDate);
        }

        return ResponseEntity.ok(customPrice);
    }

    //jsy주문등록 - 등록하기
    @PostMapping("/registOrder")
    public ResponseEntity<Long> registOrder(@RequestBody OrderRegistDTO request){
        Long orderNo = orderService.registOrder(request);

        return ResponseEntity.ok(orderNo);
    }

    //로그인 시 직원 아이디 추출
    @GetMapping("/getMyId")
    public String getMyId(Authentication authentication){
        String userId = "";

        if(authentication != null) { //인증이 되지않았다면 null입니다.
            EmployeeDetails user = (EmployeeDetails)authentication.getPrincipal(); //인증객체 안에 principal값을 얻으면 유저객체가 나옵니다.
            userId = user.getUsername();

            System.out.println("------------------권한" + user.getUserAuthorityGrade());
            System.out.println(userId);
        }
        return userId;
    }

    //담당자명 추출
    @PostMapping("/getMyName")
    public String getMyName(@RequestBody Map<String, String> requestBody) {
        String myId = requestBody.get("myId"); // JSON에서 myId 추출
        String myName = orderService.getMyName(myId); // 이름을 서비스에서 가져옴
        System.out.println("이름: " + myName);

        return myName;
    }




/* 유선화 START */
// 주문 상세 정보 조회
    @GetMapping("/detail/{orderNo}")
    public ResponseEntity<OrderHDTO> getOrderDetail(@PathVariable Long orderNo) {
        OrderHDTO orderDetail = orderService.getOrderDetail(orderNo);
        if (orderDetail != null) {
            return ResponseEntity.ok(orderDetail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

// 결재 여부에 따른 업데이트
    @PostMapping("/updateApproval")
    public ResponseEntity<?> updateApproval(@RequestBody OrderHDTO orderHDTO) {
        boolean updated = orderService.updateApproval(
                orderHDTO.getOrderNo(),
                orderHDTO.getConfirmStatus(),
                LocalDate.now(),
                orderHDTO.getRemarks()
        );
        if (updated) {
            return ResponseEntity.ok().body(Map.of("success", true));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "업데이트 실패!!"));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateOrder(@RequestBody OrderUp1DTO orderUp1DTO) {
        try {
            OrderHDTO updatedOrder = orderService.updateOrder(orderUp1DTO);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("주문 업데이트 중 오류 발생: " + e.getMessage());
        }
    }


    @GetMapping("/getManagerList/{employeeId}")
    public List<EmployeeDTO> getManagerList(@PathVariable String employeeId) {
        return employeeService.getManagerList(employeeId);
    }

/* 유선화 END */
}