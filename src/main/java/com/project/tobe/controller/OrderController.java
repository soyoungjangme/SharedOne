package com.project.tobe.controller;

import com.project.tobe.dto.*;
import com.project.tobe.entity.Employee;
import com.project.tobe.entity.OrderH;
import com.project.tobe.security.EmployeeDetails;
import com.project.tobe.service.*;
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

    @Autowired
    @Qualifier("customerService")
    private CustomerService customerService;

    @Autowired
    private ProductService productService;

    @Autowired
    private EmailService emailService;

    //jsy초기 목록 호출
    @GetMapping("/orderList")
    public List<OrderHDTO> orderList() {
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
    public ResponseEntity<List<PriceDTO>> getPrice(@RequestBody Map<String, String> request) {
        String inputOrderCustomerNo = request.get("inputOrderCustomerNo"); //문자열로 단일객체 받아서
        String delDate = request.get("inputOrderDelDate");

        List<PriceDTO> customPrice;

        if (inputOrderCustomerNo == null || inputOrderCustomerNo.isEmpty()) { //고객명 선택x
            customPrice = new ArrayList<>(); //빈 리스ㅡㅌ 반환

        } else { //고객명 데이터 들어있으면
            Integer iocn = Integer.parseInt(inputOrderCustomerNo); //데이터 정수변환
            customPrice = orderService.getPrice(iocn, delDate);
        }

        return ResponseEntity.ok(customPrice);
    }

    //jsy주문등록 - 등록하기
    @PostMapping("/registOrder")
    public ResponseEntity<Long> registOrder(@RequestBody OrderRegistDTO request) {
        Long orderNo = orderService.registOrder(request);

        if (request.getInputStatus().equals("대기")) {
            String managerEmail = employeeService.getEmail(request.getInputConfirmer());
            String employeeEmail = employeeService.getEmail(request.getInputManager());
            String customer = customerService.getCustomerName(request.getInputCustomerNo());

            StringBuilder sb = new StringBuilder();
            sb.append("납품요청일 : ").append(request.getInputDelDate()).append("\n");
            sb.append("고객 : ").append(customer).append("\n");
            sb.append("담당자 메일 : ").append(employeeEmail).append("\n");

            for (OrderBDTO dto : request.getOrderBList()) {
                String productName = productService.getProductName(dto.getProductNo());

                sb.append("\n");
                sb.append("상품명 : ").append(productName).append("\n");
                sb.append("상품 수량 : ").append(dto.getOrderProductQty()).append("\n");
                sb.append("상품 총 가격 : ").append(dto.getProdTotal()).append("\n");
            }

            EmailDTO emailDTO = EmailDTO.builder()
                    .targetMail(managerEmail)
                    .subject("주문번호 " + orderNo.toString() + " 결재 요청 드립니다.")
                    .body(sb.toString())
                    .build();

            try {
                emailService.sendMailReject(emailDTO);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        return ResponseEntity.ok(orderNo);
    }

    //로그인 시 직원 아이디 추출
    @GetMapping("/getMyId")
    public String getMyId(Authentication authentication) {
        String userId = "";

        if (authentication != null) { //인증이 되지않았다면 null입니다.
            EmployeeDetails user = (EmployeeDetails) authentication.getPrincipal(); //인증객체 안에 principal값을 얻으면 유저객체가 나옵니다.
            userId = user.getUsername();

            System.out.println("------------------권한" + user.getUserAuthorityGrade());
            System.out.println(userId);
        }
        return userId;
    }

    @GetMapping("/getMyRole")
    public String getMyRole(Authentication authentication) {
        String userRole = "";

        if (authentication != null) { //인증이 되지않았다면 null입니다.
            EmployeeDetails user = (EmployeeDetails) authentication.getPrincipal(); //인증객체 안에 principal값을 얻으면 유저객체가 나옵니다.
            userRole = user.getUserAuthorityGrade();

            System.out.println("------------------권한" + user.getUserAuthorityGrade());
            System.out.println(userRole);
        }

        return userRole;
    }

    //담당자명 추출
    @PostMapping("/getMyName")
    public String getMyName(@RequestBody Map<String, String> requestBody) {
        String myId = requestBody.get("myId"); // JSON에서 myId 추출
        String myName = orderService.getMyName(myId); // 이름을 서비스에서 가져옴
        System.out.println("이름: " + myName);

        return myName;
    }

/*
    @GetMapping("/orderSessionList")
    public EmployeeDTO getOrderSessionList(Authentication authentication){

        String userId = "";

        if(authentication != null) { //인증이 되지않았다면 null입니다.
            EmployeeDetails user = (EmployeeDetails)authentication.getPrincipal(); //인증객체 안에 principal값을 얻으면 유저객체가 나옵니다.
            userId = user.getUsername();
        }


        return employeeService.;
    }
*/


    /* 유선화 START */
// 주문 상세 정보 조회
    @GetMapping("/detail/{orderNo}")
    public ResponseEntity<OrderHDTO> getOrderDetail(@PathVariable Long orderNo) {
        OrderHDTO orderDetail = orderService.getOrderDetail(orderNo);
        if (orderDetail != null) {
            System.out.println(orderDetail.getConfirmerName());
            return ResponseEntity.ok(orderDetail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 결재 여부에 따른 업데이트
    @PostMapping("/updateApproval")
    public ResponseEntity<?> updateApproval(@RequestBody OrderHDTO orderHDTO) {
        EmployeeDTO employeeDTO = orderHDTO.getEmployee();
        boolean updated = orderService.updateApproval(
                orderHDTO.getOrderNo(),
                orderHDTO.getConfirmStatus(),
                LocalDate.now(),
                orderHDTO.getRemarks()
        );
        if (updated) {
            String employeeEmail = employeeService.getEmail(employeeDTO.getEmployeeId());
            EmailDTO dto = EmailDTO.builder()
                    .targetMail(employeeEmail)
                    .subject("주문번호 " + orderHDTO.getOrderNo() + " 결과 : " + orderHDTO.getConfirmStatus())
                    .body("주문번호 " + orderHDTO.getOrderNo() + " 번 " + orderHDTO.getConfirmStatus() + "되었습니다.")
                    .build();

            try {
                emailService.sendMailReject(dto);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

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


/*    @PostMapping("/insertBack")
    public void insertBack(@RequestBody OrderUp1DTO orderUp1DTO) {
        System.out.println(orderUp1DTO);
        orderService.insertBack(orderUp1DTO);
    }*/

    @PutMapping("/temp/{orderNo}")
    public ResponseEntity<?> updateTempOrder(@PathVariable Long orderNo, @RequestBody OrderHDTO orderHDTO) {
        // customerNo와 employeeId를 중첩된 객체에서 추출
        orderHDTO.setCustomerNo(orderHDTO.getCustomer().getCustomerNo());
        orderHDTO.setEmployeeId(orderHDTO.getEmployee().getEmployeeId());

        try {
            OrderHDTO updatedOrder = orderService.updateTempOrder(orderHDTO);

            if (orderHDTO.getConfirmStatus().equals("대기")) {
                String managerEmail = employeeService.getEmail(orderHDTO.getConfirmerId());
                String employeeEmail = employeeService.getEmail(orderHDTO.getEmployeeId());
                String customer = customerService.getCustomerName(orderHDTO.getCustomerNo());

                StringBuilder sb = new StringBuilder();
                sb.append("납품요청일 : ").append(orderHDTO.getDelDate()).append("\n");
                sb.append("고객 : ").append(customer).append("\n");
                sb.append("담당자 메일 : ").append(employeeEmail).append("\n");

                for (OrderBDTO dto : orderHDTO.getOrderBList()) {
                    String productName = productService.getProductName(dto.getProductNo());

                    sb.append("\n");
                    sb.append("상품명 : ").append(productName).append("\n");
                    sb.append("상품 수량 : ").append(dto.getOrderProductQty()).append("\n");
                    sb.append("상품 총 가격 : ").append(dto.getProdTotal()).append("\n");
                }

                EmailDTO emailDTO = EmailDTO.builder()
                        .targetMail(managerEmail)
                        .subject("주문번호 " + orderNo.toString() + " 결재 요청 드립니다.")
                        .body(sb.toString())
                        .build();

                try {
                    emailService.sendMailReject(emailDTO);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }

            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("주문 업데이트 중 오류 발생: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{orderNo}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderNo) {
        try {
            boolean isDeleted = orderService.deleteOrder(orderNo);
            if (isDeleted) {
                return ResponseEntity.ok("주문이 삭제되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("주문을 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("주문 삭제 중 오류 발생: " + e.getMessage());
        }
    }


    /* 유선화 END */

    @GetMapping("/getStatistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> map = new HashMap<>();

        EmployeeRankDTO top = orderService.getTopOfMonth();
        List<SalesByMonth> salesByMonth = orderService.getSalesByMonth();
        List<EmployeeRankDTO> employeeRank = orderService.getEmployeeRank();
        List<ProductSaleRank> productRank = orderService.getProductRank();

        map.put("topOfMonth", top);
        map.put("employeeRank", employeeRank);
        map.put("productRank", productRank);
        map.put("salesByMonth", salesByMonth);

        return map;
    }
}