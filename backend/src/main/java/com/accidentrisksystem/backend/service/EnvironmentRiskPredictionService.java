package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.dto.request.EnvironmentRiskPredictionRequestDto;
import com.accidentrisksystem.backend.dto.response.EnvironmentRiskPredictionResponseDto;
import com.accidentrisksystem.backend.dto.response.ShapExplanationDto;
import com.accidentrisksystem.backend.entity.RoadEnvironmentFeatures;
import com.accidentrisksystem.backend.exception.BadRequestException;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.iservice.IEnvironmentRiskPredictionService;
import com.accidentrisksystem.backend.repository.RoadEnvironmentFeaturesRepository;
import com.accidentrisksystem.backend.repository.RoadSegmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class EnvironmentRiskPredictionService implements IEnvironmentRiskPredictionService {

    private final RoadSegmentRepository roadSegmentRepository;
    private final RoadEnvironmentFeaturesRepository environmentFeaturesRepository;

    @Value("${ml.environment.url:http://127.0.0.1:8001/predict}")
    private String mlEnvironmentUrl;

    private static final List<String> VALID_TIME_CATEGORIES = List.of(
            "00:00-03:00",
            "03:00-06:00",
            "06:00-09:00",
            "09:00-12:00",
            "12:00-15:00",
            "15:00-18:00",
            "18:00-21:00",
            "21:00-00:00"
    );

    @Override
    public EnvironmentRiskPredictionResponseDto predict(EnvironmentRiskPredictionRequestDto request) {
        validateRequest(request);

        RoadEnvironmentFeatures envFeatures = environmentFeaturesRepository.findBySegmentId(request.getSegmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No road environment survey data recorded for segment ID: " + request.getSegmentId()
                ));

        String timeCategory = request.getTimeCategory();
        int schoolTime = ("06:00-09:00".equals(timeCategory) || "12:00-15:00".equals(timeCategory)) ? 1 : 0;
        int workRush = ("06:00-09:00".equals(timeCategory) || "15:00-18:00".equals(timeCategory) || "18:00-21:00".equals(timeCategory)) ? 1 : 0;

        Map<String, Object> fastApiRequest = new HashMap<>();
        fastApiRequest.put("segment_id", request.getSegmentId());
        fastApiRequest.put("time_category", timeCategory);
        fastApiRequest.put("school_time", schoolTime);
        fastApiRequest.put("work_rush", workRush);
        fastApiRequest.put("junction_count", envFeatures.getJunctionCount() != null ? envFeatures.getJunctionCount() : 0);
        fastApiRequest.put("school_count", envFeatures.getSchoolCount() != null ? envFeatures.getSchoolCount() : 0);
        fastApiRequest.put("hospital_count", envFeatures.getHospitalCount() != null ? envFeatures.getHospitalCount() : 0);
        fastApiRequest.put("railway_crossing_count", envFeatures.getRailwayCrossingCount() != null ? envFeatures.getRailwayCrossingCount() : 0);
        fastApiRequest.put("bridge_count", envFeatures.getBridgeCount() != null ? envFeatures.getBridgeCount() : 0);
        fastApiRequest.put("traffic_signal_count", envFeatures.getTrafficSignalCount() != null ? envFeatures.getTrafficSignalCount() : 0);
        fastApiRequest.put("pedestrian_crossing_count", envFeatures.getPedestrianCrossingCount() != null ? envFeatures.getPedestrianCrossingCount() : 0);
        fastApiRequest.put("curve_count", envFeatures.getCurveCount() != null ? envFeatures.getCurveCount() : 0);
        fastApiRequest.put("straight_road_percentage", envFeatures.getStraightRoadPercentage() != null ? envFeatures.getStraightRoadPercentage().doubleValue() : 0.0);
        fastApiRequest.put("narrow_road_percentage", envFeatures.getNarrowRoadPercentage() != null ? envFeatures.getNarrowRoadPercentage().doubleValue() : 0.0);
        fastApiRequest.put("wide_road_percentage", envFeatures.getWideRoadPercentage() != null ? envFeatures.getWideRoadPercentage().doubleValue() : 0.0);
        fastApiRequest.put("urban_percentage", envFeatures.getUrbanPercentage() != null ? envFeatures.getUrbanPercentage().doubleValue() : 0.0);
        fastApiRequest.put("rural_percentage", envFeatures.getRuralPercentage() != null ? envFeatures.getRuralPercentage().doubleValue() : 0.0);

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> fastApiResponse;

        try {
            fastApiResponse = restTemplate.postForObject(mlEnvironmentUrl, fastApiRequest, Map.class);
        } catch (Exception e) {
            throw new BadRequestException("Failed to call ML Environment prediction service: " + e.getMessage());
        }

        if (fastApiResponse == null || !fastApiResponse.containsKey("predicted_risk_level")) {
            throw new BadRequestException("Invalid response returned from Environment ML Service");
        }

        String predictedRiskLevel = fastApiResponse.get("predicted_risk_level").toString();

        Map<String, Double> classProbabilities = new LinkedHashMap<>();
        if (fastApiResponse.get("class_probabilities") instanceof Map<?, ?> probsMap) {
            probsMap.forEach((k, v) -> {
                if (k != null && v != null) {
                    classProbabilities.put(k.toString(), Double.valueOf(v.toString()));
                }
            });
        }

        List<ShapExplanationDto> shapExplanations = new ArrayList<>();
        if (fastApiResponse.get("shap_explanations") instanceof List<?> shapList) {
            for (Object item : shapList) {
                if (item instanceof Map<?, ?> itemMap) {
                    String feature = itemMap.get("feature") != null ? itemMap.get("feature").toString() : "";
                    Object val = itemMap.get("value");
                    Double shapVal = itemMap.get("shap_value") != null ? Double.valueOf(itemMap.get("shap_value").toString()) : 0.0;
                    String explanation = itemMap.get("explanation") != null ? itemMap.get("explanation").toString() : "";
                    shapExplanations.add(new ShapExplanationDto(feature, val, shapVal, explanation));
                }
            }
        }

        return new EnvironmentRiskPredictionResponseDto(
                request.getSegmentId(),
                timeCategory,
                predictedRiskLevel,
                classProbabilities,
                shapExplanations
        );
    }

    private void validateRequest(EnvironmentRiskPredictionRequestDto request) {
        if (request.getSegmentId() == null) {
            throw new BadRequestException("Segment ID is required");
        }

        if (request.getTimeCategory() == null || request.getTimeCategory().isBlank()) {
            throw new BadRequestException("Time category is required");
        }

        if (!VALID_TIME_CATEGORIES.contains(request.getTimeCategory())) {
            throw new BadRequestException("Invalid time category. Must be one of: " + String.join(", ", VALID_TIME_CATEGORIES));
        }

        if (!roadSegmentRepository.existsById(request.getSegmentId())) {
            throw new ResourceNotFoundException("Segment does not exist with ID: " + request.getSegmentId());
        }
    }
}
