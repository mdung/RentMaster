package com.rentmaster.billing;

import com.rentmaster.contract.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractServiceRepository extends JpaRepository<ContractService, Long> {
    List<ContractService> findByContractIdAndActiveTrue(Long contractId);
}

