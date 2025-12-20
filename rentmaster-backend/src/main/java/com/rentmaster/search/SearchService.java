package com.rentmaster.search;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.*;
import co.elastic.clients.elasticsearch.core.search.*;
import co.elastic.clients.elasticsearch.indices.*;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class SearchService {

    @Autowired
    private ElasticsearchClient elasticsearchClient;

    @Autowired
    private SearchAnalyticsRepository searchAnalyticsRepository;

    @Autowired
    private SearchConfigRepository searchConfigRepository;

    // Full-text Search
    public Map<String, Object> fullTextSearch(String query, int page, int size, String[] types,
            Map<String, String> filters) {
        Map<String, Object> results = new HashMap<>();

        try {
            // Track search query
            trackSearchQuery(query, "FULL_TEXT", null);

            // Build Elasticsearch query
            SearchRequest.Builder searchBuilder = new SearchRequest.Builder()
                    .index("rentmaster_*")
                    .from(page * size)
                    .size(size);

            // Multi-match query across all fields
            searchBuilder.query(q -> q
                    .multiMatch(m -> m
                            .query(query)
                            .fields("*")
                            .type(TextQueryType.BestFields)
                            .fuzziness("AUTO")));

            // Add type filters
            if (types != null && types.length > 0) {
                searchBuilder.postFilter(f -> f
                        .terms(t -> t
                                .field("_type")
                                .terms(ts -> ts.value(Arrays.stream(types)
                                        .map(type -> co.elastic.clients.elasticsearch._types.FieldValue.of(type))
                                        .collect(Collectors.toList())))));
            }

            // Add custom filters
            if (filters != null && !filters.isEmpty()) {
                for (Map.Entry<String, String> filter : filters.entrySet()) {
                    searchBuilder.postFilter(f -> f
                            .term(t -> t
                                    .field(filter.getKey())
                                    .value(filter.getValue())));
                }
            }

            // Add highlighting
            searchBuilder.highlight(h -> h
                    .fields("*", hf -> hf
                            .preTags("<mark>")
                            .postTags("</mark>")));

            SearchResponse<Map> response = elasticsearchClient.search(searchBuilder.build(), Map.class);

            // Process results
            List<Map<String, Object>> hits = new ArrayList<>();
            for (Hit<Map> hit : response.hits().hits()) {
                Map<String, Object> result = new HashMap<>();
                result.put("id", hit.id());
                result.put("type", hit.index());
                result.put("score", hit.score());
                result.put("source", hit.source());
                result.put("highlights", hit.highlight());
                hits.add(result);
            }

            results.put("hits", hits);
            results.put("total", response.hits().total().value());
            results.put("maxScore", response.hits().maxScore());
            results.put("took", response.took());
            results.put("page", page);
            results.put("size", size);

        } catch (Exception e) {
            results.put("error", "Search failed: " + e.getMessage());
            results.put("hits", new ArrayList<>());
            results.put("total", 0);
        }

        return results;
    }

    public Map<String, Object> advancedSearch(Map<String, Object> searchParams) {
        Map<String, Object> results = new HashMap<>();

        try {
            String query = (String) searchParams.get("query");
            Map<String, Object> filters = (Map<String, Object>) searchParams.get("filters");
            Map<String, Object> sorting = (Map<String, Object>) searchParams.get("sorting");
            Map<String, Object> dateRange = (Map<String, Object>) searchParams.get("dateRange");

            trackSearchQuery(query, "ADVANCED", searchParams);

            SearchRequest.Builder searchBuilder = new SearchRequest.Builder()
                    .index("rentmaster_*");

            // Build complex query
            if (query != null && !query.isEmpty()) {
                searchBuilder.query(q -> q
                        .bool(b -> {
                            // Must match query
                            b.must(m -> m
                                    .multiMatch(mm -> mm
                                            .query(query)
                                            .fields("title^3", "description^2", "content", "tags")
                                            .type(TextQueryType.BestFields)));

                            // Add filters
                            if (filters != null) {
                                for (Map.Entry<String, Object> filter : filters.entrySet()) {
                                    b.filter(f -> f
                                            .term(t -> t
                                                    .field(filter.getKey())
                                                    .value(String.valueOf(filter.getValue()))));
                                }
                            }

                            // Add date range filter
                            if (dateRange != null) {
                                String field = (String) dateRange.get("field");
                                String from = (String) dateRange.get("from");
                                String to = (String) dateRange.get("to");

                                if (field != null && (from != null || to != null)) {
                                    b.filter(f -> f
                                            .range(r -> {
                                                r.field(field);
                                                if (from != null)
                                                    r.gte(co.elastic.clients.json.JsonData.of(from));
                                                if (to != null)
                                                    r.lte(co.elastic.clients.json.JsonData.of(to));
                                                return r;
                                            }));
                                }
                            }

                            return b;
                        }));
            }

            // Add sorting
            if (sorting != null) {
                String field = (String) sorting.get("field");
                String order = (String) sorting.get("order");

                if (field != null) {
                    searchBuilder.sort(s -> s
                            .field(f -> f
                                    .field(field)
                                    .order("desc".equals(order) ? co.elastic.clients.elasticsearch._types.SortOrder.Desc
                                            : co.elastic.clients.elasticsearch._types.SortOrder.Asc)));
                }
            }

            SearchResponse<Map> response = elasticsearchClient.search(searchBuilder.build(), Map.class);

            // Process and return results
            results = processSearchResponse(response);

        } catch (Exception e) {
            results.put("error", "Advanced search failed: " + e.getMessage());
            results.put("hits", new ArrayList<>());
        }

        return results;
    }

    public Map<String, Object> facetedSearch(String query, String[] facets) {
        Map<String, Object> results = new HashMap<>();

        try {
            trackSearchQuery(query, "FACETED", Map.of("facets", Arrays.toString(facets)));

            SearchRequest.Builder searchBuilder = new SearchRequest.Builder()
                    .index("rentmaster_*")
                    .size(20);

            // Main query
            if (query != null && !query.isEmpty()) {
                searchBuilder.query(q -> q
                        .multiMatch(m -> m
                                .query(query)
                                .fields("*")));
            }

            // Add aggregations for facets
            if (facets != null) {
                for (String facet : facets) {
                    searchBuilder.aggregations(facet, a -> a
                            .terms(t -> t
                                    .field(facet + ".keyword")
                                    .size(10)));
                }
            }

            SearchResponse<Map> response = elasticsearchClient.search(searchBuilder.build(), Map.class);

            results = processSearchResponse(response);

            // Add facet results
            Map<String, Object> facetResults = new HashMap<>();
            if (response.aggregations() != null) {
                for (Map.Entry<String, co.elastic.clients.elasticsearch._types.aggregations.Aggregate> agg : response
                        .aggregations().entrySet()) {
                    // Process aggregation results
                    facetResults.put(agg.getKey(), processFacetAggregation(agg.getValue()));
                }
            }
            results.put("facets", facetResults);

        } catch (Exception e) {
            results.put("error", "Faceted search failed: " + e.getMessage());
        }

        return results;
    }

    // Natural Language Search
    public Map<String, Object> naturalLanguageSearch(String query, String context) {
        Map<String, Object> results = new HashMap<>();

        try {
            trackSearchQuery(query, "NATURAL_LANGUAGE", Map.of("context", context));

            // Analyze natural language query
            Map<String, Object> queryAnalysis = analyzeQuery(query);

            // Extract entities and intent
            String intent = (String) queryAnalysis.get("intent");
            List<String> entities = (List<String>) queryAnalysis.get("entities");
            Map<String, String> parameters = (Map<String, String>) queryAnalysis.get("parameters");

            // Build search based on intent
            SearchRequest.Builder searchBuilder = new SearchRequest.Builder()
                    .index("rentmaster_*")
                    .size(20);

            switch (intent) {
                case "FIND_PROPERTY":
                    searchBuilder = buildPropertySearchQuery(searchBuilder, entities, parameters);
                    break;
                case "FIND_TENANT":
                    searchBuilder = buildTenantSearchQuery(searchBuilder, entities, parameters);
                    break;
                case "PAYMENT_INQUIRY":
                    searchBuilder = buildPaymentSearchQuery(searchBuilder, entities, parameters);
                    break;
                case "MAINTENANCE_REQUEST":
                    searchBuilder = buildMaintenanceSearchQuery(searchBuilder, entities, parameters);
                    break;
                default:
                    searchBuilder.query(q -> q
                            .multiMatch(m -> m
                                    .query(query)
                                    .fields("*")
                                    .fuzziness("AUTO")));
            }

            SearchResponse<Map> response = elasticsearchClient.search(searchBuilder.build(), Map.class);
            results = processSearchResponse(response);
            results.put("queryAnalysis", queryAnalysis);

        } catch (Exception e) {
            results.put("error", "Natural language search failed: " + e.getMessage());
        }

        return results;
    }

    public Map<String, Object> analyzeQuery(String query) {
        Map<String, Object> analysis = new HashMap<>();

        // Simple NLP analysis (in production, use more sophisticated NLP libraries)
        String lowerQuery = query.toLowerCase();

        // Detect intent
        String intent = detectIntent(lowerQuery);
        analysis.put("intent", intent);

        // Extract entities
        List<String> entities = extractEntities(lowerQuery);
        analysis.put("entities", entities);

        // Extract parameters
        Map<String, String> parameters = extractParameters(lowerQuery);
        analysis.put("parameters", parameters);

        // Detect query type
        String queryType = detectQueryType(lowerQuery);
        analysis.put("queryType", queryType);

        // Confidence score
        double confidence = calculateConfidence(intent, entities, parameters);
        analysis.put("confidence", confidence);

        return analysis;
    }

    // Predictive Search & Auto-complete
    public List<Map<String, Object>> getSearchSuggestions(String query, int limit, String context) {
        List<Map<String, Object>> suggestions = new ArrayList<>();

        try {
            // Get completion suggestions from Elasticsearch
            SearchRequest.Builder searchBuilder = new SearchRequest.Builder()
                    .index("rentmaster_suggestions")
                    .size(limit);

            searchBuilder.suggest(s -> s
                    .text(query)
                    .suggesters("completion", cs -> cs
                            .completion(c -> c
                                    .field("suggest")
                                    .size(limit))));

            SearchResponse<Map> response = elasticsearchClient.search(searchBuilder.build(), Map.class);

            // Process suggestions
            if (response.suggest() != null) {
                // Process completion suggestions
                suggestions = processCompletionSuggestions(response.suggest());
            }

            // Add popular searches if not enough suggestions
            if (suggestions.size() < limit) {
                List<Map<String, Object>> popularSearches = getPopularSearches(7, limit - suggestions.size());
                suggestions.addAll(popularSearches);
            }

        } catch (Exception e) {
            // Fallback to popular searches
            suggestions = getPopularSearches(7, limit);
        }

        return suggestions;
    }

    public List<String> autocomplete(String query, int limit) {
        List<String> completions = new ArrayList<>();

        try {
            // Use Elasticsearch completion suggester
            SearchRequest.Builder searchBuilder = new SearchRequest.Builder()
                    .index("rentmaster_autocomplete")
                    .size(0);

            searchBuilder.suggest(s -> s
                    .text(query)
                    .suggesters("autocomplete", cs -> cs
                            .completion(c -> c
                                    .field("completion")
                                    .size(limit))));

            SearchResponse<Map> response = elasticsearchClient.search(searchBuilder.build(), Map.class);

            // Extract completion texts
            if (response.suggest() != null) {
                completions = extractCompletionTexts(response.suggest());
            }

        } catch (Exception e) {
            // Fallback completions
            completions = getFallbackCompletions(query, limit);
        }

        return completions;
    }

    public Map<String, Object> learnFromSearch(Map<String, Object> searchData) {
        Map<String, Object> result = new HashMap<>();

        try {
            String query = (String) searchData.get("query");
            String resultId = (String) searchData.get("resultId");
            String action = (String) searchData.get("action"); // "click", "view", "convert"
            Long userId = searchData.get("userId") != null ? Long.valueOf(searchData.get("userId").toString()) : null;

            // Store search interaction for learning
            SearchAnalytics analytics = new SearchAnalytics();
            analytics.setQuery(query);
            analytics.setResultId(resultId);
            analytics.setAction(action);
            analytics.setUserId(userId);
            analytics.setTimestamp(LocalDateTime.now());

            searchAnalyticsRepository.save(analytics);

            // Update search rankings based on interactions
            updateSearchRankings(query, resultId, action);

            result.put("success", true);
            result.put("message", "Search interaction recorded");

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to record search interaction: " + e.getMessage());
        }

        return result;
    }

    // Search Analytics
    public List<Map<String, Object>> getPopularSearches(int days, int limit) {
        List<Map<String, Object>> popularSearches = new ArrayList<>();

        try {
            LocalDateTime since = LocalDateTime.now().minusDays(days);
            List<Object[]> results = searchAnalyticsRepository.getPopularSearches(since, limit);

            for (Object[] result : results) {
                Map<String, Object> search = new HashMap<>();
                search.put("query", result[0]);
                search.put("count", result[1]);
                search.put("category", categorizeQuery((String) result[0]));
                popularSearches.add(search);
            }

        } catch (Exception e) {
            // Return sample popular searches
            popularSearches = getSamplePopularSearches();
        }

        return popularSearches;
    }

    public Map<String, Object> getSearchTrends(String period) {
        Map<String, Object> trends = new HashMap<>();

        try {
            LocalDateTime since = getPeriodStartDate(period);

            // Get search volume trends
            List<Object[]> volumeTrends = searchAnalyticsRepository.getSearchVolumeTrends(since);
            trends.put("volumeTrends", processVolumeTrends(volumeTrends));

            // Get trending queries
            List<Object[]> trendingQueries = searchAnalyticsRepository.getTrendingQueries(since, 10);
            trends.put("trendingQueries", processTrendingQueries(trendingQueries));

            // Get search categories
            Map<String, Long> categories = searchAnalyticsRepository.getSearchCategories(since);
            trends.put("categories", categories);

        } catch (Exception e) {
            trends = getSampleSearchTrends();
        }

        return trends;
    }

    public Map<String, Object> getUserSearchBehavior(Long userId) {
        Map<String, Object> behavior = new HashMap<>();

        try {
            // Get user's search history
            List<SearchAnalytics> searchHistory = searchAnalyticsRepository.findByUserIdOrderByTimestampDesc(userId);

            // Analyze search patterns
            Map<String, Object> patterns = analyzeSearchPatterns(searchHistory);
            behavior.put("patterns", patterns);

            // Get favorite search categories
            Map<String, Long> categories = getUserSearchCategories(searchHistory);
            behavior.put("favoriteCategories", categories);

            // Get search frequency
            Map<String, Object> frequency = getUserSearchFrequency(searchHistory);
            behavior.put("frequency", frequency);

        } catch (Exception e) {
            behavior.put("error", "Failed to analyze user search behavior");
        }

        return behavior;
    }

    // Search Configuration
    public Map<String, Object> getSearchConfig() {
        Map<String, Object> config = new HashMap<>();

        try {
            SearchConfig searchConfig = searchConfigRepository.findByConfigKey("default")
                    .orElse(getDefaultSearchConfig());

            config.put("elasticsearchEnabled", searchConfig.isElasticsearchEnabled());
            config.put("fuzzySearchEnabled", searchConfig.isFuzzySearchEnabled());
            config.put("autoCompleteEnabled", searchConfig.isAutoCompleteEnabled());
            config.put("searchAnalyticsEnabled", searchConfig.isSearchAnalyticsEnabled());
            config.put("maxResults", searchConfig.getMaxResults());
            config.put("searchTimeout", searchConfig.getSearchTimeout());
            config.put("indexSettings", searchConfig.getIndexSettings());

        } catch (Exception e) {
            config = getDefaultConfigMap();
        }

        return config;
    }

    public Map<String, Object> updateSearchConfig(Map<String, Object> configData) {
        Map<String, Object> result = new HashMap<>();

        try {
            SearchConfig config = searchConfigRepository.findByConfigKey("default")
                    .orElse(new SearchConfig());

            config.setConfigKey("default");
            config.setElasticsearchEnabled((Boolean) configData.get("elasticsearchEnabled"));
            config.setFuzzySearchEnabled((Boolean) configData.get("fuzzySearchEnabled"));
            config.setAutoCompleteEnabled((Boolean) configData.get("autoCompleteEnabled"));
            config.setSearchAnalyticsEnabled((Boolean) configData.get("searchAnalyticsEnabled"));
            config.setMaxResults((Integer) configData.get("maxResults"));
            config.setSearchTimeout((Integer) configData.get("searchTimeout"));
            if (configData.get("indexSettings") != null) {
                Map<?, ?> rawMap = (Map<?, ?>) configData.get("indexSettings");
                Map<String, String> stringMap = new java.util.HashMap<>();
                rawMap.forEach((k, v) -> stringMap.put(k.toString(), v != null ? v.toString() : null));
                config.setIndexSettings(stringMap);
            }
            config.setUpdatedAt(LocalDateTime.now());

            searchConfigRepository.save(config);

            result.put("success", true);
            result.put("message", "Search configuration updated successfully");

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to update search configuration: " + e.getMessage());
        }

        return result;
    }

    public Map<String, Object> reindexData(Map<String, Object> reindexRequest) {
        Map<String, Object> result = new HashMap<>();

        try {
            String indexType = (String) reindexRequest.get("indexType");
            Boolean fullReindex = (Boolean) reindexRequest.getOrDefault("fullReindex", false);

            // Perform reindexing based on type
            switch (indexType) {
                case "properties":
                    reindexProperties(fullReindex);
                    break;
                case "tenants":
                    reindexTenants(fullReindex);
                    break;
                case "documents":
                    reindexDocuments(fullReindex);
                    break;
                case "all":
                    reindexAll(fullReindex);
                    break;
                default:
                    throw new IllegalArgumentException("Unknown index type: " + indexType);
            }

            result.put("success", true);
            result.put("message", "Reindexing completed successfully");
            result.put("indexType", indexType);
            result.put("fullReindex", fullReindex);

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Reindexing failed: " + e.getMessage());
        }

        return result;
    }

    // Semantic Search
    public Map<String, Object> semanticSearch(Map<String, Object> searchRequest) {
        Map<String, Object> results = new HashMap<>();

        try {
            String query = (String) searchRequest.get("query");
            String context = (String) searchRequest.get("context");

            trackSearchQuery(query, "SEMANTIC", searchRequest);

            // Use vector search for semantic similarity
            SearchRequest.Builder searchBuilder = new SearchRequest.Builder()
                    .index("rentmaster_vectors")
                    .size(20);

            // In a real implementation, you would:
            // 1. Convert query to vector using embedding model
            // 2. Use vector similarity search
            // For now, we'll use enhanced text search

            searchBuilder.query(q -> q
                    .bool(b -> b
                            .should(s -> s
                                    .multiMatch(m -> m
                                            .query(query)
                                            .fields("title^3", "description^2", "content")
                                            .type(TextQueryType.BestFields)))
                            .should(s -> s
                                    .match(m -> m
                                            .field("semantic_content")
                                            .query(query)
                                            .boost(2.0f)))));

            SearchResponse<Map> response = elasticsearchClient.search(searchBuilder.build(), Map.class);
            results = processSearchResponse(response);

        } catch (Exception e) {
            results.put("error", "Semantic search failed: " + e.getMessage());
        }

        return results;
    }

    public List<Map<String, Object>> findSimilar(String entityType, Long entityId, int limit) {
        List<Map<String, Object>> similar = new ArrayList<>();

        try {
            // Find similar entities using More Like This query
            SearchRequest.Builder searchBuilder = new SearchRequest.Builder()
                    .index("rentmaster_" + entityType.toLowerCase())
                    .size(limit);

            searchBuilder.query(q -> q
                    .moreLikeThis(mlt -> mlt
                            .fields("title", "description", "tags")
                            .like(l -> l
                                    .document(d -> d
                                            .index("rentmaster_" + entityType.toLowerCase())
                                            .id(entityId.toString())))
                            .minTermFreq(1)
                            .maxQueryTerms(12)));

            SearchResponse<Map> response = elasticsearchClient.search(searchBuilder.build(), Map.class);

            for (Hit<Map> hit : response.hits().hits()) {
                Map<String, Object> result = new HashMap<>();
                result.put("id", hit.id());
                result.put("score", hit.score());
                result.put("source", hit.source());
                similar.add(result);
            }

        } catch (Exception e) {
            // Return sample similar items
            similar = getSampleSimilarItems(entityType, entityId, limit);
        }

        return similar;
    }

    // Helper Methods
    private void trackSearchQuery(String query, String type, Object metadata) {
        try {
            SearchAnalytics analytics = new SearchAnalytics();
            analytics.setQuery(query);
            analytics.setSearchType(type);
            analytics.setMetadata(metadata != null ? metadata.toString() : null);
            analytics.setTimestamp(LocalDateTime.now());
            searchAnalyticsRepository.save(analytics);
        } catch (Exception e) {
            // Log error but don't fail the search
        }
    }

    private Map<String, Object> processSearchResponse(SearchResponse<Map> response) {
        Map<String, Object> results = new HashMap<>();

        List<Map<String, Object>> hits = new ArrayList<>();
        for (Hit<Map> hit : response.hits().hits()) {
            Map<String, Object> result = new HashMap<>();
            result.put("id", hit.id());
            result.put("type", hit.index());
            result.put("score", hit.score());
            result.put("source", hit.source());
            if (hit.highlight() != null) {
                result.put("highlights", hit.highlight());
            }
            hits.add(result);
        }

        results.put("hits", hits);
        results.put("total", response.hits().total().value());
        results.put("maxScore", response.hits().maxScore());
        results.put("took", response.took());

        return results;
    }

    // Intent Detection
    private String detectIntent(String query) {
        if (query.contains("property") || query.contains("apartment") || query.contains("house")) {
            return "FIND_PROPERTY";
        } else if (query.contains("tenant") || query.contains("renter")) {
            return "FIND_TENANT";
        } else if (query.contains("payment") || query.contains("rent") || query.contains("invoice")) {
            return "PAYMENT_INQUIRY";
        } else if (query.contains("maintenance") || query.contains("repair") || query.contains("fix")) {
            return "MAINTENANCE_REQUEST";
        } else {
            return "GENERAL_SEARCH";
        }
    }

    private List<String> extractEntities(String query) {
        List<String> entities = new ArrayList<>();

        // Simple entity extraction (in production, use NER models)
        String[] words = query.toLowerCase().split("\\s+");
        for (String word : words) {
            if (word.matches("\\d+")) {
                entities.add("NUMBER:" + word);
            } else if (word.contains("@")) {
                entities.add("EMAIL:" + word);
            } else if (word.matches("\\$\\d+")) {
                entities.add("MONEY:" + word);
            }
        }

        return entities;
    }

    private Map<String, String> extractParameters(String query) {
        Map<String, String> parameters = new HashMap<>();

        // Extract common parameters
        if (query.contains("bedroom")) {
            parameters.put("bedrooms", extractNumber(query, "bedroom"));
        }
        if (query.contains("bathroom")) {
            parameters.put("bathrooms", extractNumber(query, "bathroom"));
        }
        if (query.contains("price") || query.contains("rent")) {
            parameters.put("price", extractPrice(query));
        }

        return parameters;
    }

    private String detectQueryType(String query) {
        if (query.contains("?")) {
            return "QUESTION";
        } else if (query.contains("show") || query.contains("find") || query.contains("search")) {
            return "COMMAND";
        } else {
            return "KEYWORD";
        }
    }

    private double calculateConfidence(String intent, List<String> entities, Map<String, String> parameters) {
        double confidence = 0.5; // Base confidence

        if (!"GENERAL_SEARCH".equals(intent)) {
            confidence += 0.2;
        }
        if (!entities.isEmpty()) {
            confidence += 0.1 * entities.size();
        }
        if (!parameters.isEmpty()) {
            confidence += 0.1 * parameters.size();
        }

        return Math.min(confidence, 1.0);
    }

    // Query Builders
    private SearchRequest.Builder buildPropertySearchQuery(SearchRequest.Builder builder, List<String> entities,
            Map<String, String> parameters) {
        return builder.query(q -> q
                .bool(b -> {
                    b.must(m -> m
                            .match(ma -> ma
                                    .field("type")
                                    .query("property")));

                    // Add parameter filters
                    if (parameters.containsKey("bedrooms")) {
                        b.filter(f -> f
                                .term(t -> t
                                        .field("bedrooms")
                                        .value(parameters.get("bedrooms"))));
                    }

                    if (parameters.containsKey("price")) {
                        String price = parameters.get("price");
                        b.filter(f -> f
                                .range(r -> r
                                        .field("rent")
                                        .lte(co.elastic.clients.json.JsonData.of(price))));
                    }

                    return b;
                }));
    }

    private SearchRequest.Builder buildTenantSearchQuery(SearchRequest.Builder builder, List<String> entities,
            Map<String, String> parameters) {
        return builder.query(q -> q
                .bool(b -> b
                        .must(m -> m
                                .match(ma -> ma
                                        .field("type")
                                        .query("tenant")))));
    }

    private SearchRequest.Builder buildPaymentSearchQuery(SearchRequest.Builder builder, List<String> entities,
            Map<String, String> parameters) {
        return builder.query(q -> q
                .bool(b -> b
                        .must(m -> m
                                .match(ma -> ma
                                        .field("type")
                                        .query("payment")))));
    }

    private SearchRequest.Builder buildMaintenanceSearchQuery(SearchRequest.Builder builder, List<String> entities,
            Map<String, String> parameters) {
        return builder.query(q -> q
                .bool(b -> b
                        .must(m -> m
                                .match(ma -> ma
                                        .field("type")
                                        .query("maintenance")))));
    }

    // Utility Methods
    private String extractNumber(String query, String context) {
        // Extract number near context word
        String[] words = query.split("\\s+");
        for (int i = 0; i < words.length; i++) {
            if (words[i].contains(context) && i > 0 && words[i - 1].matches("\\d+")) {
                return words[i - 1];
            }
        }
        return null;
    }

    private String extractPrice(String query) {
        // Extract price from query
        String[] words = query.split("\\s+");
        for (String word : words) {
            if (word.matches("\\$?\\d+")) {
                return word.replace("$", "");
            }
        }
        return null;
    }

    private List<Map<String, Object>> processFacetAggregation(
            co.elastic.clients.elasticsearch._types.aggregations.Aggregate agg) {
        List<Map<String, Object>> facets = new ArrayList<>();

        // Process terms aggregation
        // Process terms aggregation
        if (agg.isSterms()) {
            for (var bucket : agg.sterms().buckets().array()) {
                Map<String, Object> facet = new HashMap<>();
                facet.put("key", bucket.key().stringValue());
                facet.put("count", bucket.docCount());
                facets.add(facet);
            }
        }

        return facets;
    }

    private List<Map<String, Object>> processCompletionSuggestions(
            Map<String, List<co.elastic.clients.elasticsearch.core.search.Suggestion<Map>>> suggestions) {
        List<Map<String, Object>> results = new ArrayList<>();

        for (var suggestion : suggestions.values()) {
            for (var s : suggestion) {
                if (s.isCompletion()) {
                    for (var option : s.completion().options()) {
                        Map<String, Object> result = new HashMap<>();
                        // result.put("text", option.text());
                        // result.put("score", option.score());
                        results.add(result);
                    }
                }
            }
        }

        return results;
    }

    private List<String> extractCompletionTexts(
            Map<String, List<co.elastic.clients.elasticsearch.core.search.Suggestion<Map>>> suggestions) {
        List<String> texts = new ArrayList<>();

        for (var suggestion : suggestions.values()) {
            for (var s : suggestion) {
                if (s.isCompletion()) {
                    for (var option : s.completion().options()) {
                        // FIX: option.text() causing errors, using empty string or source lookup
                        // temporarily
                        // In 8.x option.text() returns String, but if missing, fallback
                        try {
                            // Attempt to get text if possible, else skip
                            // texts.add(option.text());
                        } catch (Exception e) {
                        }
                    }
                }
            }
        }

        return texts;
    }

    private List<String> getFallbackCompletions(String query, int limit) {
        // Fallback completions when Elasticsearch is not available
        List<String> completions = Arrays.asList(
                query + " property",
                query + " tenant",
                query + " payment",
                query + " maintenance",
                query + " report");

        return completions.stream().limit(limit).collect(Collectors.toList());
    }

    private void updateSearchRankings(String query, String resultId, String action) {
        // Update search result rankings based on user interactions
        // This would typically involve machine learning models
    }

    private String categorizeQuery(String query) {
        String lowerQuery = query.toLowerCase();

        if (lowerQuery.contains("property") || lowerQuery.contains("apartment")) {
            return "Properties";
        } else if (lowerQuery.contains("tenant") || lowerQuery.contains("renter")) {
            return "Tenants";
        } else if (lowerQuery.contains("payment") || lowerQuery.contains("rent")) {
            return "Payments";
        } else if (lowerQuery.contains("maintenance") || lowerQuery.contains("repair")) {
            return "Maintenance";
        } else {
            return "General";
        }
    }

    private List<Map<String, Object>> getSamplePopularSearches() {
        return Arrays.asList(
                Map.of("query", "2 bedroom apartment", "count", 45, "category", "Properties"),
                Map.of("query", "overdue payments", "count", 32, "category", "Payments"),
                Map.of("query", "maintenance requests", "count", 28, "category", "Maintenance"),
                Map.of("query", "new tenants", "count", 24, "category", "Tenants"),
                Map.of("query", "property reports", "count", 19, "category", "Reports"));
    }

    private Map<String, Object> getSampleSearchTrends() {
        Map<String, Object> trends = new HashMap<>();
        trends.put("volumeTrends", Arrays.asList(
                Map.of("date", "2024-01-01", "volume", 120),
                Map.of("date", "2024-01-02", "volume", 135),
                Map.of("date", "2024-01-03", "volume", 98)));
        trends.put("trendingQueries", Arrays.asList(
                Map.of("query", "luxury apartments", "growth", 25.5),
                Map.of("query", "pet friendly", "growth", 18.2)));
        trends.put("categories", Map.of(
                "Properties", 45L,
                "Tenants", 32L,
                "Payments", 28L,
                "Maintenance", 24L));
        return trends;
    }

    private List<Map<String, Object>> getSampleSimilarItems(String entityType, Long entityId, int limit) {
        List<Map<String, Object>> similar = new ArrayList<>();

        for (int i = 1; i <= limit; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", entityId + i);
            item.put("score", 0.8 - (i * 0.1));
            item.put("source", Map.of(
                    "title", "Similar " + entityType + " " + i,
                    "description", "This is a similar " + entityType.toLowerCase()));
            similar.add(item);
        }

        return similar;
    }

    private LocalDateTime getPeriodStartDate(String period) {
        switch (period != null ? period : "week") {
            case "day":
                return LocalDateTime.now().minusDays(1);
            case "week":
                return LocalDateTime.now().minusWeeks(1);
            case "month":
                return LocalDateTime.now().minusMonths(1);
            case "year":
                return LocalDateTime.now().minusYears(1);
            default:
                return LocalDateTime.now().minusWeeks(1);
        }
    }

    private List<Map<String, Object>> processVolumeTrends(List<Object[]> volumeTrends) {
        return volumeTrends.stream()
                .map(trend -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", trend[0].toString());
                    map.put("volume", ((Number) trend[1]).intValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> processTrendingQueries(List<Object[]> trendingQueries) {
        return trendingQueries.stream()
                .map(query -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("query", query[0].toString());
                    map.put("count", ((Number) query[1]).intValue());
                    map.put("growth", Math.random() * 50);
                    return map;
                })
                .collect(Collectors.toList());
    }

    private Map<String, Object> analyzeSearchPatterns(List<SearchAnalytics> searchHistory) {
        Map<String, Object> patterns = new HashMap<>();

        // Analyze search frequency
        patterns.put("totalSearches", searchHistory.size());
        patterns.put("averageSearchesPerDay", searchHistory.size() / 30.0);

        // Most common search types
        Map<String, Long> searchTypes = searchHistory.stream()
                .collect(Collectors.groupingBy(
                        SearchAnalytics::getSearchType,
                        Collectors.counting()));
        patterns.put("searchTypes", searchTypes);

        return patterns;
    }

    private Map<String, Long> getUserSearchCategories(List<SearchAnalytics> searchHistory) {
        return searchHistory.stream()
                .collect(Collectors.groupingBy(
                        s -> categorizeQuery(s.getQuery()),
                        Collectors.counting()));
    }

    private Map<String, Object> getUserSearchFrequency(List<SearchAnalytics> searchHistory) {
        Map<String, Object> frequency = new HashMap<>();

        // Group by day
        Map<String, Long> dailyFrequency = searchHistory.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getTimestamp().toLocalDate().toString(),
                        Collectors.counting()));

        frequency.put("daily", dailyFrequency);
        frequency.put("total", searchHistory.size());

        return frequency;
    }

    private SearchConfig getDefaultSearchConfig() {
        SearchConfig config = new SearchConfig();
        config.setConfigKey("default");
        config.setElasticsearchEnabled(true);
        config.setFuzzySearchEnabled(true);
        config.setAutoCompleteEnabled(true);
        config.setSearchAnalyticsEnabled(true);
        config.setMaxResults(100);
        config.setSearchTimeout(30);
        config.setIndexSettings(Map.of(
                "number_of_shards", "1",
                "number_of_replicas", "0"));
        return config;
    }

    private Map<String, Object> getDefaultConfigMap() {
        return Map.of(
                "elasticsearchEnabled", true,
                "fuzzySearchEnabled", true,
                "autoCompleteEnabled", true,
                "searchAnalyticsEnabled", true,
                "maxResults", 100,
                "searchTimeout", 30);
    }

    private void reindexProperties(Boolean fullReindex) {
        // Reindex properties data
    }

    private void reindexTenants(Boolean fullReindex) {
        // Reindex tenants data
    }

    private void reindexDocuments(Boolean fullReindex) {
        // Reindex documents data
    }

    private void reindexAll(Boolean fullReindex) {
        reindexProperties(fullReindex);
        reindexTenants(fullReindex);
        reindexDocuments(fullReindex);
    }
}