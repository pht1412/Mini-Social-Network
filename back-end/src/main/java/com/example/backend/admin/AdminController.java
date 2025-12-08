package com.example.backend.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import com.example.backend.Enum.Visibility;

import com.example.backend.Post.Post;
import com.example.backend.Post.PostRepository;
import com.example.backend.Post.PostDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private PostRepository postRepository;

    public ResponseEntity<String> getAdminDashboard() {
        return ResponseEntity.ok("Admin Dashboard");
    }

    // ⭐️ 1. API DUYỆT BÀI VIẾT (Chuyển sang PUBLIC)
    @PostMapping("/approve-post/{post_id}")
    public ResponseEntity<String> approvePost(@PathVariable Long post_id) {
        try {
            Optional<Post> postOptional = postRepository.findById(post_id);
            if (postOptional.isPresent()) {
                Post post = postOptional.get();
                post.setVisibility(Visibility.PUBLIC); // Chuyển trạng thái
                postRepository.save(post); // Lưu xuống DB
                return ResponseEntity.ok("Duyệt bài thành công!");
            }
            return ResponseEntity.badRequest().body("Không tìm thấy bài viết");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // ⭐️ 2. API LẤY DANH SÁCH BÀI VIẾT
    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts() {
        try {
            // Lấy tất cả bài viết, sắp xếp giảm dần theo ID (mới nhất lên đầu)
            List<Post> posts = postRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

            // Map entities to DTOs to avoid Jackson/Hibernate serialization issues
            List<PostDto> dtos = posts.stream().map(p -> new PostDto(
                p.getId(),
                p.getAuthor() != null ? p.getAuthor().getId() : null,
                p.getAuthor() != null ? p.getAuthor().getUsername() : null,
                p.getContent(),
                p.getVisibility(),
                p.getLikeCount(),
                p.getCommentCount(),
                p.getShareCount()
            )).collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải bài viết: " + e.getMessage());
        }
    }

    // ⭐️ 3. API XÓA BÀI VIẾT
    @DeleteMapping("/delete-post/{post_id}")
    public ResponseEntity<String> deletePost(@PathVariable Long post_id, @RequestParam String reason) {
        try {
            if (postRepository.existsById(post_id)) {
                postRepository.deleteById(post_id);
                // (Optional) Có thể lưu 'reason' vào bảng Log nếu cần
                return ResponseEntity.ok("Đã xóa bài viết.");
            }
            return ResponseEntity.badRequest().body("Bài viết không tồn tại");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xóa bài: " + e.getMessage());
        }
    }

    @PostMapping("/ban-user/{user_id}")
    public ResponseEntity<String> banUser(@PathVariable Long user_id) {
        try {
            // Logic to ban user here
            return ResponseEntity.ok("thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("thất bại");
        }
    }

    @PostMapping("/approve-user/{user_id}")
    public ResponseEntity<String> approveUser(@PathVariable Long user_id) {
        try {
            // Logic to approve user here
            return ResponseEntity.ok("thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("thất bại");
        }
    }

    @GetMapping("/posts-count")
    public ResponseEntity<Long> countPosts() {
        try {
            long count = postRepository.countPosts();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(0L);
        }
    }
    
}