package com.reglog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "JWTToken")
public class JWTToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tid")
    private Long tid;

    @Column(name = "uid", nullable = false)
    private Long uid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid", insertable = false, updatable = false)
    private User user;

    @Column(name = "token", nullable = false, columnDefinition = "TEXT")
    private String token;

    @Column(name = "createdtime", nullable = false)
    private LocalDateTime createdtime;

    @Column(name = "expiretime", nullable = false)
    private LocalDateTime expiretime;

    public JWTToken() {
    }

    public JWTToken(Long uid, String token, LocalDateTime createdtime, LocalDateTime expiretime) {
        this.uid = uid;
        this.token = token;
        this.createdtime = createdtime;
        this.expiretime = expiretime;
    }

    public Long getTid() {
        return tid;
    }

    public void setTid(Long tid) {
        this.tid = tid;
    }

    public Long getUid() {
        return uid;
    }

    public void setUid(Long uid) {
        this.uid = uid;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getCreatedtime() {
        return createdtime;
    }

    public void setCreatedtime(LocalDateTime createdtime) {
        this.createdtime = createdtime;
    }

    public LocalDateTime getExpiretime() {
        return expiretime;
    }

    public void setExpiretime(LocalDateTime expiretime) {
        this.expiretime = expiretime;
    }
}
