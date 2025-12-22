package com.rentmaster.financial;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByPropertyId(Long propertyId);
    
    List<Expense> findByCategory(String category);
    
    @Query("SELECT e FROM Expense e WHERE e.expenseDate >= :startDate AND e.expenseDate <= :endDate")
    List<Expense> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT e FROM Expense e WHERE e.propertyId = :propertyId AND e.expenseDate >= :startDate AND e.expenseDate <= :endDate")
    List<Expense> findByPropertyAndDateRange(
        @Param("propertyId") Long propertyId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.expenseDate >= :startDate AND e.expenseDate <= :endDate GROUP BY e.category")
    List<Object[]> getExpensesByCategory(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

