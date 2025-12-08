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
    public Page<PostResponse> getNewsFeed(Long currentUserId, Pageable pageable) {
        Page<Post> postPage = postRepository.findAllForNewsFeed(pageable);
        List<Long> postIds = postPage.getContent().stream().map(Post::getId).toList();
        Set<Long> likedPostIds = postRepository.findPostIdsLikedByUser(currentUserId, postIds);
        
        return postPage.map(post -> mapToPostResponse(post, likedPostIds));
    }

    private PostResponse mapToPostResponse(Post post, Set<Long> likedPostIds) {
        User author = post.getAuthor();

        UserResponse authorDto = UserResponse.builder()
                .id(author.getId())
                .username(author.getUsername())
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

        return new PostResponse(
                post.getId(),
                post.getContent(),
                post.getVisibility(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                authorDto,
                mediaDtos,
                post.getLikeCount(),
                post.getCommentCount(),
                likedPostIds.contains(post.getId())
        );
    }
}
