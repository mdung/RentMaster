package com.rentmaster.search;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @Autowired
    private AIInsightsService aiInsightsService;

    @Autowired
    private RecommendationService recommendationService;

    // Full-text Search
    @GetMapping("/full-text")
    public ResponseEntity<Map<String, Object>> fullTextSearch(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String[] types,
            @RequestParam(required = false) Map<String, String> filters) {
        Map<String, Object> results = searchService.fullTextSearch(query, page, size, types, filters);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/advanced")
    public ResponseEntity<Map<String, Object>> advancedSearch(@RequestParam Map<String, Object> searchParams) {
        Map<String, Object> results = searchService.advancedSearch(searchParams);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/faceted")
    public ResponseEntity<Map<String, Object>> facetedSearch(
            @RequestParam String query,
            @RequestParam(required = false) String[] facets) {
        Map<String, Object> results = searchService.facetedSearch(query, facets);
        return ResponseEntity.ok(results);
    }

    // Natural Language Search
    @PostMapping("/natural-language")
    public ResponseEntity<Map<String, Object>> naturalLanguageSearch(@RequestBody Map<String, Object> searchRequest) {
        String query = (String) searchRequest.get("query");
        String context = (String) searchRequest.get("context");
        Map<String, Object> results = searchService.naturalLanguageSearch(query, context);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/query-understanding")
    public ResponseEntity<Map<String, Object>> analyzeQuery(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        Map<String, Object> analysis = searchService.analyzeQuery(query);
        return ResponseEntity.ok(analysis);
    }

    // Predictive Search & Auto-complete
    @GetMapping("/suggestions")
    public ResponseEntity<List<Map<String, Object>>> getSearchSuggestions(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String context) {
        List<Map<String, Object>> suggestions = searchService.getSearchSuggestions(query, limit, context);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> autocomplete(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int limit) {
        List<String> completions = searchService.autocomplete(query, limit);
        return ResponseEntity.ok(completions);
    }

    @PostMapping("/learn-from-search")
    public ResponseEntity<Map<String, Object>> learnFromSearch(@RequestBody Map<String, Object> searchData) {
        Map<String, Object> result = searchService.learnFromSearch(searchData);
        return ResponseEntity.ok(result);
    }

    // AI-powered Insights
    @GetMapping("/insights/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardInsights(@RequestParam(required = false) Long userId) {
        Map<String, Object> insights = aiInsightsService.getDashboardInsights(userId);
        return ResponseEntity.ok(insights);
    }

    @GetMapping("/insights/property/{propertyId}")
    public ResponseEntity<Map<String, Object>> getPropertyInsights(@PathVariable Long propertyId) {
        Map<String, Object> insights = aiInsightsService.getPropertyInsights(propertyId);
        return ResponseEntity.ok(insights);
    }

    @GetMapping("/insights/tenant/{tenantId}")
    public ResponseEntity<Map<String, Object>> getTenantInsights(@PathVariable Long tenantId) {
        Map<String, Object> insights = aiInsightsService.getTenantInsights(tenantId);
        return ResponseEntity.ok(insights);
    }

    @GetMapping("/insights/financial")
    public ResponseEntity<Map<String, Object>> getFinancialInsights(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) Long propertyId) {
        Map<String, Object> insights = aiInsightsService.getFinancialInsights(period, propertyId);
        return ResponseEntity.ok(insights);
    }

    @GetMapping("/insights/maintenance")
    public ResponseEntity<Map<String, Object>> getMaintenanceInsights() {
        Map<String, Object> insights = aiInsightsService.getMaintenanceInsights();
        return ResponseEntity.ok(insights);
    }

    @GetMapping("/insights/market-trends")
    public ResponseEntity<Map<String, Object>> getMarketTrends(@RequestParam(required = false) String location) {
        Map<String, Object> trends = aiInsightsService.getMarketTrends(location);
        return ResponseEntity.ok(trends);
    }

    @PostMapping("/insights/predict")
    public ResponseEntity<Map<String, Object>> generatePredictions(@RequestBody Map<String, Object> predictionRequest) {
        Map<String, Object> predictions = aiInsightsService.generatePredictions(predictionRequest);
        return ResponseEntity.ok(predictions);
    }

    // Smart Recommendations
    @GetMapping("/recommendations/properties")
    public ResponseEntity<List<Map<String, Object>>> getPropertyRecommendations(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "5") int limit) {
        List<Map<String, Object>> recommendations = recommendationService.getPropertyRecommendations(userId, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/recommendations/tenants")
    public ResponseEntity<List<Map<String, Object>>> getTenantRecommendations(
            @RequestParam Long propertyId,
            @RequestParam(defaultValue = "5") int limit) {
        List<Map<String, Object>> recommendations = recommendationService.getTenantRecommendations(propertyId, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/recommendations/pricing")
    public ResponseEntity<Map<String, Object>> getPricingRecommendations(@RequestParam Long propertyId) {
        Map<String, Object> recommendations = recommendationService.getPricingRecommendations(propertyId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/recommendations/maintenance")
    public ResponseEntity<List<Map<String, Object>>> getMaintenanceRecommendations(@RequestParam Long propertyId) {
        List<Map<String, Object>> recommendations = recommendationService.getMaintenanceRecommendations(propertyId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/recommendations/investment")
    public ResponseEntity<List<Map<String, Object>>> getInvestmentRecommendations(@RequestParam Long userId) {
        List<Map<String, Object>> recommendations = recommendationService.getInvestmentRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    @PostMapping("/recommendations/feedback")
    public ResponseEntity<Map<String, Object>> submitRecommendationFeedback(@RequestBody Map<String, Object> feedback) {
        Map<String, Object> result = recommendationService.submitFeedback(feedback);
        return ResponseEntity.ok(result);
    }

    // Search Analytics
    @GetMapping("/analytics/popular-searches")
    public ResponseEntity<List<Map<String, Object>>> getPopularSearches(
            @RequestParam(defaultValue = "7") int days,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> searches = searchService.getPopularSearches(days, limit);
        return ResponseEntity.ok(searches);
    }

    @GetMapping("/analytics/search-trends")
    public ResponseEntity<Map<String, Object>> getSearchTrends(@RequestParam(required = false) String period) {
        Map<String, Object> trends = searchService.getSearchTrends(period);
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/analytics/user-behavior")
    public ResponseEntity<Map<String, Object>> getUserSearchBehavior(@RequestParam Long userId) {
        Map<String, Object> behavior = searchService.getUserSearchBehavior(userId);
        return ResponseEntity.ok(behavior);
    }

    // Search Configuration
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getSearchConfig() {
        Map<String, Object> config = searchService.getSearchConfig();
        return ResponseEntity.ok(config);
    }

    @PostMapping("/config")
    public ResponseEntity<Map<String, Object>> updateSearchConfig(@RequestBody Map<String, Object> config) {
        Map<String, Object> result = searchService.updateSearchConfig(config);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reindex")
    public ResponseEntity<Map<String, Object>> reindexData(@RequestBody Map<String, Object> reindexRequest) {
        Map<String, Object> result = searchService.reindexData(reindexRequest);
        return ResponseEntity.ok(result);
    }

    // Semantic Search
    @PostMapping("/semantic")
    public ResponseEntity<Map<String, Object>> semanticSearch(@RequestBody Map<String, Object> searchRequest) {
        Map<String, Object> results = searchService.semanticSearch(searchRequest);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/similar")
    public ResponseEntity<List<Map<String, Object>>> findSimilar(
            @RequestParam String entityType,
            @RequestParam Long entityId,
            @RequestParam(defaultValue = "5") int limit) {
        List<Map<String, Object>> similar = searchService.findSimilar(entityType, entityId, limit);
        return ResponseEntity.ok(similar);
    }
}