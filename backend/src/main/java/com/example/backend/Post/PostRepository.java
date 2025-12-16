package com.example.backend.Post;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query(value = "SELECT p FROM Post p JOIN FETCH p.author u WHERE p.visibility = 'PUBLIC'",
        countQuery = "SELECT COUNT(p) FROM Post p WHERE p.visibility = 'PUBLIC'")
    Page<Post> findAllForNewsFeed(Pageable pageable);

    @Query("SELECT p.id FROM Post p JOIN p.likedBy u WHERE u.id = :userId AND p.id IN :postIds")
    Set<Long> findPostIdsLikedByUser(Long userId, List<Long> postIds);
    
    @Query("SELECT COUNT(p) FROM Post p")
    long countPosts();

    @Query("SELECT DISTINCT p FROM Post p JOIN FETCH p.author LEFT JOIN FETCH p.media ORDER BY p.id DESC")
    List<Post> findAllWithAuthorAndMedia();
}
