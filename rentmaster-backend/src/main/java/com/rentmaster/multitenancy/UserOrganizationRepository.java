package com.rentmaster.multitenancy;

import com.rentmaster.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserOrganizationRepository extends JpaRepository<UserOrganization, Long> {
    List<UserOrganization> findByUser(User user);
    List<UserOrganization> findByOrganization(Organization organization);
    Optional<UserOrganization> findByUserAndOrganization(User user, Organization organization);
    Optional<UserOrganization> findByUserAndIsDefaultTrue(User user);
}

