package com.example.backend.Game;

import com.example.backend.Game.GameScore;
import com.example.backend.Game.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping("/leaderboard/{gameKey}")
    public ResponseEntity<?> getLeaderboard(@PathVariable String gameKey) {
        List<GameScore> topScores = gameService.getLeaderboard(gameKey);
        return ResponseEntity.ok(topScores);
    }

    @PostMapping("/score")
    public ResponseEntity<?> submitScore(@RequestBody ScoreRequest request) {
        // Lưu ý: Sau này userId sẽ lấy từ Token, giờ test tạm lấy từ body
        GameScore savedScore = gameService.saveScore(
            request.getUserId(), 
            request.getGameKey(), 
            request.getScore()
        );
        return ResponseEntity.ok(Map.of("message", "Score saved!", "data", savedScore));
    }
}

// DTO chỉnh sửa ID thành Integer
class ScoreRequest {
    private Integer userId; // <-- ĐÃ SỬA
    private String gameKey;
    private int score;

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public String getGameKey() { return gameKey; }
    public void setGameKey(String gameKey) { this.gameKey = gameKey; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
}