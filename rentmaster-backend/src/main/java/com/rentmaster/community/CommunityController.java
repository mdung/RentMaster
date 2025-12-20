package com.rentmaster.community;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "*")
public class CommunityController {
    
    @Autowired
    private CommunityService communityService;
    
    // Communities Management
    @GetMapping("/communities")
    public ResponseEntity<List<Map<String, Object>>> getCommunities(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) Boolean isPublic) {
        try {
            List<Map<String, Object>> communities = communityService.getCommunities(type, propertyId, isPublic);
            return ResponseEntity.ok(communities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/communities/{id}")
    public ResponseEntity<Map<String, Object>> getCommunity(@PathVariable Long id) {
        try {
            Map<String, Object> community = communityService.getCommunity(id);
            return ResponseEntity.ok(community);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/communities")
    public ResponseEntity<Map<String, Object>> createCommunity(@RequestBody Map<String, Object> communityData) {
        try {
            Map<String, Object> community = communityService.createCommunity(communityData);
            return ResponseEntity.ok(community);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/communities/{id}")
    public ResponseEntity<Map<String, Object>> updateCommunity(
            @PathVariable Long id,
            @RequestBody Map<String, Object> communityData) {
        try {
            Map<String, Object> community = communityService.updateCommunity(id, communityData);
            return ResponseEntity.ok(community);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/communities/{id}")
    public ResponseEntity<Void> deleteCommunity(@PathVariable Long id) {
        try {
            communityService.deleteCommunity(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/communities/{id}/join")
    public ResponseEntity<Map<String, Object>> joinCommunity(
            @PathVariable Long id,
            @RequestParam Long tenantId) {
        try {
            Map<String, Object> result = communityService.joinCommunity(id, tenantId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/communities/{id}/leave")
    public ResponseEntity<Map<String, Object>> leaveCommunity(
            @PathVariable Long id,
            @RequestParam Long tenantId) {
        try {
            Map<String, Object> result = communityService.leaveCommunity(id, tenantId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Posts Management
    @GetMapping("/communities/{communityId}/posts")
    public ResponseEntity<List<Map<String, Object>>> getCommunityPosts(
            @PathVariable Long communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String sortBy) {
        try {
            List<Map<String, Object>> posts = communityService.getCommunityPosts(communityId, page, size, type, sortBy);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/posts/{id}")
    public ResponseEntity<Map<String, Object>> getPost(@PathVariable Long id) {
        try {
            Map<String, Object> post = communityService.getPost(id);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/communities/{communityId}/posts")
    public ResponseEntity<Map<String, Object>> createPost(
            @PathVariable Long communityId,
            @RequestBody Map<String, Object> postData) {
        try {
            Map<String, Object> post = communityService.createPost(communityId, postData);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/posts/{id}")
    public ResponseEntity<Map<String, Object>> updatePost(
            @PathVariable Long id,
            @RequestBody Map<String, Object> postData) {
        try {
            Map<String, Object> post = communityService.updatePost(id, postData);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        try {
            communityService.deletePost(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/posts/{id}/like")
    public ResponseEntity<Map<String, Object>> likePost(
            @PathVariable Long id,
            @RequestParam Long tenantId) {
        try {
            Map<String, Object> result = communityService.likePost(id, tenantId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/posts/{id}/unlike")
    public ResponseEntity<Map<String, Object>> unlikePost(
            @PathVariable Long id,
            @RequestParam Long tenantId) {
        try {
            Map<String, Object> result = communityService.unlikePost(id, tenantId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Comments Management
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<Map<String, Object>>> getPostComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            List<Map<String, Object>> comments = communityService.getPostComments(postId, page, size);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Map<String, Object>> createComment(
            @PathVariable Long postId,
            @RequestBody Map<String, Object> commentData) {
        try {
            Map<String, Object> comment = communityService.createComment(postId, commentData);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/comments/{id}")
    public ResponseEntity<Map<String, Object>> updateComment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> commentData) {
        try {
            Map<String, Object> comment = communityService.updateComment(id, commentData);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        try {
            communityService.deleteComment(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Events Management
    @GetMapping("/communities/{communityId}/events")
    public ResponseEntity<List<Map<String, Object>>> getCommunityEvents(
            @PathVariable Long communityId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        try {
            List<Map<String, Object>> events = communityService.getCommunityEvents(communityId, status, type);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/communities/{communityId}/events")
    public ResponseEntity<Map<String, Object>> createEvent(
            @PathVariable Long communityId,
            @RequestBody Map<String, Object> eventData) {
        try {
            Map<String, Object> event = communityService.createEvent(communityId, eventData);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/events/{id}")
    public ResponseEntity<Map<String, Object>> updateEvent(
            @PathVariable Long id,
            @RequestBody Map<String, Object> eventData) {
        try {
            Map<String, Object> event = communityService.updateEvent(id, eventData);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/events/{id}/attend")
    public ResponseEntity<Map<String, Object>> attendEvent(
            @PathVariable Long id,
            @RequestParam Long tenantId) {
        try {
            Map<String, Object> result = communityService.attendEvent(id, tenantId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/events/{id}/unattend")
    public ResponseEntity<Map<String, Object>> unattendEvent(
            @PathVariable Long id,
            @RequestParam Long tenantId) {
        try {
            Map<String, Object> result = communityService.unattendEvent(id, tenantId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Announcements Management
    @GetMapping("/announcements")
    public ResponseEntity<List<Map<String, Object>>> getAnnouncements(
            @RequestParam(required = false) String targetAudience,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) Boolean active) {
        try {
            List<Map<String, Object>> announcements = communityService.getAnnouncements(targetAudience, propertyId, active);
            return ResponseEntity.ok(announcements);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/announcements")
    public ResponseEntity<Map<String, Object>> createAnnouncement(@RequestBody Map<String, Object> announcementData) {
        try {
            Map<String, Object> announcement = communityService.createAnnouncement(announcementData);
            return ResponseEntity.ok(announcement);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/announcements/{id}")
    public ResponseEntity<Map<String, Object>> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody Map<String, Object> announcementData) {
        try {
            Map<String, Object> announcement = communityService.updateAnnouncement(id, announcementData);
            return ResponseEntity.ok(announcement);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/announcements/{id}/read")
    public ResponseEntity<Map<String, Object>> markAnnouncementAsRead(
            @PathVariable Long id,
            @RequestParam Long tenantId) {
        try {
            Map<String, Object> result = communityService.markAnnouncementAsRead(id, tenantId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Community Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCommunityStats(
            @RequestParam(required = false) Long communityId) {
        try {
            Map<String, Object> stats = communityService.getCommunityStats(communityId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}