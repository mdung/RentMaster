package com.rentmaster.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    List<Tenant> findByFullNameContainingIgnoreCase(String name);
    Optional<Tenant> findByPhone(String phone);
    Optional<Tenant> findByEmail(String email);
}

