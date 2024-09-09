package com.project.tobe.repository;

import com.project.tobe.entity.Confirm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConfirmRepository extends JpaRepository<Confirm, Long> {

    List<Confirm> findByCustName(String custName);

    // JPQL을 사용한 커스텀 쿼리
    @Query("SELECT c FROM Confirm c WHERE c.productType = :productType AND c.productQty > :minQty")
    List<Confirm> findByProductTypeAndMinimumQuantity(@Param("productType") String productType, @Param("minQty") int minQty);

    // 네이티브 SQL 쿼리 사용
    @Query(value = "SELECT * FROM confirms WHERE YEAR(confirm_date) = :year", nativeQuery = true)
    List<Confirm> findAllInYear(@Param("year") int year);

    // 업데이트 쿼리
    @Query("UPDATE Confirm c SET c.confirmStatus = :status WHERE c.id = :id")
    void updateConfirmStatus(@Param("id") Long id, @Param("status") String status);
}
