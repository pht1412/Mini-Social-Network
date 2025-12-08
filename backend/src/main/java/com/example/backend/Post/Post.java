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

@Entity
@Table(name = "posts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Post extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id")
    private User author;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_post_id")
    private Post originalPost;

    @Enumerated(EnumType.STRING)
    private Visibility visibility = Visibility.PUBLIC;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sharer_id")
    private User sharer;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 20)
    private List<PostMedia> media = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "post_likes",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> likedBy = new HashSet<>();

    @Column(nullable = false)
    private Long likeCount = 0L;

    @Column(nullable = false)
    private Long commentCount = 0L;

    @Column(nullable = false)
    private Long shareCount = 0L;
}
