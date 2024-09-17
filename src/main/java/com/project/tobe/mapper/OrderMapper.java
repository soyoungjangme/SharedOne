package com.project.tobe.mapper;
import com.project.tobe.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {
    List<OrderHDTO> getOrder(OrderSearchDTO criteria); //jsy 조건조회
    List<PriceDTO> getPrice(Integer iocn); //jsy 주문등록 판매가 가져오기
    void registOrderH(OrderHDTO hdto); //jsy 주문 등록하기 - 헤더
    void registOrderB(OrderBDTO bdto); //jsy 주문 등록하기 - 바디

    /*유선화 START*/
    OrderHDTO getOrderDetail(Long orderNo); // 상세 조회
    void updateOrderHeader(OrderUp1DTO orderH); // 헤더 업데이트
    void updateOrderBody(@Param("orderNo") Long orderNo, @Param("orderB")  List<OrderUp2DTO> orderB); // 바디 업데이트
    /*유선화 END*/
}
