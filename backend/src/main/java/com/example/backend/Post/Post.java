package com.example.backend.Post;

import java.util.*;
import org.hibernate.annotations.*;
import com.example.backend.BaseEntity.BaseEntity;
import com.example.backend.Comment.Comment;
import com.example.backend.Enum.Visibility;
import com.example.backend.PostMedia.PostMedia;
import com.example.backend.User.User;
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.*;

// ⭐️ Import Jackson annotations
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "posts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
// ⭐️ Ngăn lỗi Lazy Loading chung cho cả class
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Post extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id")
    // ⭐️ Khi lấy Author, không lấy ngược lại danh sách posts của Author để tránh vòng lặp
    @JsonIgnoreProperties({"posts", "comments", "password", "hibernateLazyInitializer", "handler"})
    private User author;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_post_id")
    // ⭐️ QUAN TRỌNG: Ngắt vòng lặp self-reference tại đây
    // Khi serialize `originalPost`, chúng ta bỏ qua các trường phức tạp bên trong nó để tránh đệ quy sâu
    @JsonIgnoreProperties({"originalPost", "comments", "media", "likedBy", "hibernateLazyInitializer", "handler"})
    private Post originalPost;

    @Enumerated(EnumType.STRING)
    private Visibility visibility = Visibility.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sharer_id")
    @JsonIgnoreProperties({"posts", "comments", "password", "hibernateLazyInitializer", "handler"})
    private User sharer;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 20)
    // ⭐️ Ngắt vòng lặp với Media (nếu PostMedia có field 'post')
    @JsonIgnoreProperties("post")
    private List<PostMedia> media = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    // ⭐️ Trong trang Admin, thường không cần load hết comment khi lấy danh sách bài viết -> Ignore để tối ưu
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "post_likes",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    // ⭐️ Ignore danh sách like để tránh load quá nặng
    @JsonIgnore
    private Set<User> likedBy = new HashSet<>();

    @Column(nullable = false)
    private Long likeCount = 0L;

    @Column(nullable = false)
    private Long commentCount = 0L;

    @Column(nullable = false)
    private Long shareCount = 0L;
}
