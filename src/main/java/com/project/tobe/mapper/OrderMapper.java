package com.project.tobe.mapper;
import com.project.tobe.dto.OrderBDTO;
import com.project.tobe.dto.OrderHDTO;
import com.project.tobe.dto.OrderSearchDTO;
import com.project.tobe.dto.PriceDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface OrderMapper {
    List<OrderHDTO> getOrder(OrderSearchDTO criteria); //조건조회
    List<PriceDTO> getPrice(Integer iocn); //주문등록 판매가 가져오기

    /*유선화 START*/
    OrderHDTO getOrderDetail(Long orderNo); // 상세 조회
    void updateOrderHeader(OrderHDTO orderH); // 헤더 업데이트
    void updateOrderBody(Long orderNo, OrderBDTO orderB); // 바디 업데이트
    /*유선화 END*/
}
