package com.example.backend.Post;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.PostMedia.MediaResponse;
import com.example.backend.User.User;
import com.example.backend.User.UserResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedService {
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    // ⭐️ SỬA: Đổi tham số từ Long -> Integer để khớp với User Entity
    public Page<PostResponse> getNewsFeed(Integer currentUserId, Pageable pageable) {
        Page<Post> postPage = postRepository.findAllForNewsFeed(pageable);
        List<Long> postIds = postPage.getContent().stream().map(Post::getId).toList();
        
        // Lưu ý: Nếu method findPostIdsLikedByUser bên Repo vẫn nhận Long, huynh cần ép kiểu (long) currentUserId
        // Nhưng tốt nhất nên sửa Repo nhận Integer. Tạm thời đệ ép kiểu Long ở đây để tránh lỗi biên dịch Repo.
        Set<Long> likedPostIds = postRepository.findPostIdsLikedByUser(Long.valueOf(currentUserId), postIds);
        
        return postPage.map(post -> mapToPostResponse(post, likedPostIds));
    }

    private PostResponse mapToPostResponse(Post post, Set<Long> likedPostIds) {
        User author = post.getAuthor();

        // ⭐️ SỬA: Dùng builder đúng, thay username bằng studentCode
        UserResponse authorDto = UserResponse.builder()
                .id(author.getId())
                .studentCode(author.getStudentCode()) // Sửa getUsername() -> getStudentCode()
                .fullName(author.getFullName())
                .avatarUrl(author.getAvatarUrl())
                .build();

        List<MediaResponse> mediaDtos = post.getMedia().stream()
                .map(m -> MediaResponse.builder()
                        .id(m.getId())
                        .url(m.getMediaUrl())
                        .type(m.getMediaType().toString())
                        .build())
                .collect(Collectors.toList());

        return PostResponse.builder() // ⭐️ Nên dùng Builder cho PostResponse luôn cho đồng bộ
                .id(post.getId())
                .content(post.getContent())
                .visibility(post.getVisibility())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .author(authorDto)
                .media(mediaDtos)
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .isLikedByCurrentUser(likedPostIds.contains(post.getId()))
                .build();
    }
}