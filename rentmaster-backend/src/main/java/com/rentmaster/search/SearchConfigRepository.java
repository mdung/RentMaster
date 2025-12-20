package com.rentmaster.search;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SearchConfigRepository extends JpaRepository<SearchConfig, Long> {
    
    Optional<SearchConfig> findByConfigKey(String configKey);
    
    boolean existsByConfigKey(String configKey);
}