package com.project.tobe.repository;

import com.project.tobe.dto.PriceSearchDTO;
import com.project.tobe.entity.Price;
import com.project.tobe.entity.QPrice;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class PriceRepositoryImpl implements PriceCustomRepository {
    @PersistenceContext
    private EntityManager entityManager;

    private final JPAQueryFactory jpaQueryFactory;

    public PriceRepositoryImpl(EntityManager entityManager) {
        this.jpaQueryFactory = new JPAQueryFactory(entityManager);
    }

    @Override
    public List<Price> getPriceByDTO(PriceSearchDTO dto) {
        BooleanBuilder builder = new BooleanBuilder();

        QPrice price = QPrice.price;



        return List.of();
    }
}
