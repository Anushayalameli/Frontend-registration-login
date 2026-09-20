package com.reglog.auth;

import com.reglog.entity.JWTToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface AuthenticationRepository extends JpaRepository<JWTToken, Long> {

    Optional<JWTToken> findByToken(String token);

    @Transactional
    @Modifying
    @Query("DELETE FROM JWTToken t WHERE t.token = :token")
    void deleteByToken(@Param("token") String token);

    @Transactional
    @Modifying
    @Query("DELETE FROM JWTToken t WHERE t.uid = :uid")
    void deleteByUid(@Param("uid") Long uid);
}
