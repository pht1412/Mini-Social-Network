package com.example.backend.User;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(columnDefinition = "NVARCHAR(30)")
    private String fullName;

    private String avatarUrl;
    
    public User(Long id, String username, String fullName, String avatarUrl) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
    }
}
