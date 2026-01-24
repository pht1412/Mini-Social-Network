package com.example.backend.User;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    // ... (Giữ nguyên các trường cũ: id, studentCode, email, password...)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "student_code", length = 50, unique = true)
    private String studentCode;

    @Column(length = 100, unique = true)
    private String email;
    
    @Column(name = "password_hash", length = 255)
    private String password;

    @Column(name = "full_name", columnDefinition = "nvarchar(50)")
    private String fullName;

    @Column(name = "class_name", length = 50)
    private String className;

    @Column(length = 50)
    private String role; 

    // --- CẬP NHẬT: ẢNH ĐẠI DIỆN ---
    @Column(name = "avatar_url", length = 255) // Tăng độ dài để chứa đường dẫn file
    private String avatarUrl;

    // --- MỚI: THÊM ẢNH BÌA (BACKGROUND) ---
    @Column(name = "cover_photo_url", length = 255)
    private String coverPhotoUrl;

    @Column(columnDefinition = "nvarchar(500)") // Tăng độ dài Bio cho thoải mái
    private String bio;

    private Boolean active;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (active == null) active = false;
        if (role == null) role = "STUDENT";
    }
}