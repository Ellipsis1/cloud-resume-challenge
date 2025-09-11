package com.bluellipsis.resume_api;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Lightweight Lambda handler for visitor counter functionality
 * Direct AWS integration without Spring Boot complexity
 */
public class VisitorCounterHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private static final String TABLE_NAME = "resume-visitor-count";
    private static final String VISITOR_COUNT_ID = "visitor-count";
    private static final String COUNT_ATTRIBUTE = "visit_count";
    private static final String ID_ATTRIBUTE = "id";

    private final DynamoDbClient dynamoDbClient;
    private final ObjectMapper objectMapper;

    public VisitorCounterHandler() {
        // Initialize DynamoDB client
        this.dynamoDbClient = DynamoDbClient.builder()
                .region(Region.US_EAST_1)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        // Debug logging
        context.getLogger().log("=== DEBUG INFO ===");
        context.getLogger().log("Input object: " + (input != null ? "not null" : "NULL"));
        if (input != null) {
            context.getLogger().log("HTTP Method: " + input.getHttpMethod());
            context.getLogger().log("Path: " + input.getPath());
            context.getLogger().log("Resource: " + input.getResource());
            context.getLogger().log("Headers: " + input.getHeaders());
        }
        context.getLogger().log("==================");

        try {
            // If input is null, create a default response
            if (input == null) {
                context.getLogger().log("Input is null, treating as POST request");
                return handleIncrementVisitorCount(context);
            }

            String httpMethod = input.getHttpMethod();

            // Handle null httpMethod from API Gateway
            if (httpMethod == null) {
                context.getLogger().log("HTTP method is null, defaulting to POST");
                httpMethod = "POST";
            }

            context.getLogger().log("Processing method: " + httpMethod);

            switch (httpMethod.toUpperCase()) {
                case "GET":
                    return handleGetVisitorCount(context);
                case "POST":
                    return handleIncrementVisitorCount(context);
                case "OPTIONS":
                    return createCorsResponse();
                default:
                    return createErrorResponse(405, "Method not allowed: " + httpMethod);
            }

        } catch (Exception e) {
            context.getLogger().log("Error: " + e.getMessage());
            e.printStackTrace();
            return createErrorResponse(500, "Internal server error: " + e.getMessage());
        }
    }

    /**
     * Handle GET request - return current visitor count without incrementing
     */
    private APIGatewayProxyResponseEvent handleGetVisitorCount(Context context) {
        try {
            long count = getCurrentVisitorCount();

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("count", count);
            responseBody.put("timestamp", System.currentTimeMillis());
            responseBody.put("action", "get");

            return createSuccessResponse(responseBody);

        } catch (Exception e) {
            context.getLogger().log("Error getting visitor count: " + e.getMessage());
            return createErrorResponse(500, "Failed to retrieve visitor count");
        }
    }

    /**
     * Handle POST request - increment and return new visitor count
     */
    private APIGatewayProxyResponseEvent handleIncrementVisitorCount(Context context) {
        try {
            long newCount = incrementVisitorCount();

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("count", newCount);
            responseBody.put("timestamp", System.currentTimeMillis());
            responseBody.put("action", "increment");

            context.getLogger().log("Visitor count incremented to: " + newCount);
            return createSuccessResponse(responseBody);

        } catch (Exception e) {
            context.getLogger().log("Error incrementing visitor count: " + e.getMessage());
            return createErrorResponse(500, "Failed to increment visitor count");
        }
    }

    /**
     * Get current visitor count from DynamoDB
     */
    private long getCurrentVisitorCount() {
        GetItemRequest request = GetItemRequest.builder()
                .tableName(TABLE_NAME)
                .key(Map.of(ID_ATTRIBUTE, AttributeValue.builder().s(VISITOR_COUNT_ID).build()))
                .build();

        GetItemResponse response = dynamoDbClient.getItem(request);

        if (response.hasItem() && response.item().containsKey(COUNT_ATTRIBUTE)) {
            return Long.parseLong(response.item().get(COUNT_ATTRIBUTE).n());
        }
        return 0L;
    }

    /**
     * Increment visitor count atomically in DynamoDB
     */
    private long incrementVisitorCount() {
        UpdateItemRequest request = UpdateItemRequest.builder()
                .tableName(TABLE_NAME)
                .key(Map.of(ID_ATTRIBUTE, AttributeValue.builder().s(VISITOR_COUNT_ID).build()))
                .updateExpression("ADD " + COUNT_ATTRIBUTE + " :increment")
                .expressionAttributeValues(Map.of(
                        ":increment", AttributeValue.builder().n("1").build()
                ))
                .returnValues(ReturnValue.UPDATED_NEW)
                .build();

        UpdateItemResponse response = dynamoDbClient.updateItem(request);

        if (response.hasAttributes() && response.attributes().containsKey(COUNT_ATTRIBUTE)) {
            return Long.parseLong(response.attributes().get(COUNT_ATTRIBUTE).n());
        }

        throw new RuntimeException("Failed to get updated visitor count");
    }

    /**
     * Create successful API Gateway response with CORS headers
     */
    private APIGatewayProxyResponseEvent createSuccessResponse(Map<String, Object> body) {
        try {
            APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
            response.setStatusCode(200);
            response.setHeaders(createCorsHeaders());
            response.setBody(objectMapper.writeValueAsString(body));
            return response;
        } catch (Exception e) {
            return createErrorResponse(500, "Error creating response");
        }
    }

    /**
     * Create error API Gateway response with CORS headers
     */
    private APIGatewayProxyResponseEvent createErrorResponse(int statusCode, String message) {
        try {
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("error", message);
            errorBody.put("statusCode", statusCode);
            errorBody.put("timestamp", System.currentTimeMillis());

            APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
            response.setStatusCode(statusCode);
            response.setHeaders(createCorsHeaders());
            response.setBody(objectMapper.writeValueAsString(errorBody));
            return response;
        } catch (Exception e) {
            APIGatewayProxyResponseEvent fallback = new APIGatewayProxyResponseEvent();
            fallback.setStatusCode(500);
            fallback.setHeaders(createCorsHeaders());
            fallback.setBody("{\"error\":\"Internal server error\"}");
            return fallback;
        }
    }

    /**
     * Create CORS preflight response
     */
    private APIGatewayProxyResponseEvent createCorsResponse() {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        response.setStatusCode(200);
        response.setHeaders(createCorsHeaders());
        response.setBody("");
        return response;
    }

    /**
     * Create CORS headers for API responses
     */
    private Map<String, String> createCorsHeaders() {
        Map<String, String> headers = new HashMap<>();
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.put("Access-Control-Allow-Headers", "Content-Type, Authorization");
        headers.put("Content-Type", "application/json");
        return headers;
    }
}