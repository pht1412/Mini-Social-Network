package com.example.backend.Post;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.Enum.MediaType;
import com.example.backend.PostMedia.MediaResponse;
import com.example.backend.PostMedia.PostMedia;
import com.example.backend.User.User;
import com.example.backend.User.UserResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private User getMockUser() {
        return new User(1L, "mockuser", "Nguyễn Văn Mock", "https://i.pravatar.cc/150?u=999");
    }

    @Transactional
    public PostResponse createPost(PostRequest request) {
        User currentUser = getMockUser();

        Post post = new Post();
        post.setContent(request.getContent());
        post.setAuthor(currentUser);
        post.setSharer(currentUser);
        post.setOriginalPost(post);
        post.setVisibility(request.getVisibility());

        if (request.getMediaFiles() != null && !request.getMediaFiles().isEmpty()) {
            List<PostMedia> mediaList = new ArrayList<>();

            for (MultipartFile file : request.getMediaFiles()) {
                String fileUrl = storeFileToLocal(file);
                PostMedia media = new PostMedia();
                media.setPost(post);
                media.setMediaUrl(fileUrl);
                media.setMediaType(detectMediaType(file));
                mediaList.add(media);
            }
            post.setMedia(mediaList);
        }

        Post savedPost = postRepository.save(post);
        return mapToPostResponse(savedPost);
    }

    @Transactional
    public PostResponse updatePost(Long postId, PostRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found!"));

        post.setContent(request.getContent());
        post.setVisibility(request.getVisibility());

        var currentMediaList = post.getMedia();
        currentMediaList.clear();
        if (request.getMediaFiles() != null && !request.getMediaFiles().isEmpty()) {
            for (MultipartFile file : request.getMediaFiles()) {
                String fileUrl = storeFileToLocal(file);
                PostMedia media = new PostMedia();
                media.setPost(post);
                media.setMediaUrl(fileUrl);
                media.setMediaType(detectMediaType(file));
                currentMediaList.add(media);
            }
        }

        Post updatedPost = postRepository.save(post);
        return mapToPostResponse(updatedPost);
    }

    @Transactional
    public String deletePost(Long postId) {
        try {
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found!"));
            postRepository.delete(post);
            return "Post deleted successfully";
        } catch (Exception ex) {
            return "Error deleting post: " + ex.toString();
        }
    }

    private PostResponse mapToPostResponse(Post post) {
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

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .visibility(post.getVisibility())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .author(authorDto)
                .media(mediaDtos)
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .isLikedByCurrentUser(false)
                .build();
    }

    private String storeFileToLocal(MultipartFile file) {
        try {            
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + fileName; 
        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename(), e);
        }
    }

    private MediaType detectMediaType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null) return MediaType.IMAGE;
        if (contentType.startsWith("video")) return MediaType.VIDEO;
        if (contentType.startsWith("audio")) return MediaType.AUDIO;

        return MediaType.IMAGE;
    }
}
