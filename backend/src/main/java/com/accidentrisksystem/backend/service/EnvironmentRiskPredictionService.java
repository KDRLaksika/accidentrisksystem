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
import java.util.concurrent.ConcurrentHashMap;

import com.accidentrisksystem.backend.dto.request.WhatIfSimulationRequestDto;
import com.accidentrisksystem.backend.dto.response.WhatIfSimulationResponseDto;
import com.accidentrisksystem.backend.dto.response.TemporalMapAllSlotsResponseDto;
import com.accidentrisksystem.backend.dto.response.TemporalMapSegmentResponseDto;
import com.accidentrisksystem.backend.entity.RoadSegment;

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

        return executePrediction(request.getSegmentId(), request.getTimeCategory(),
                envFeatures.getJunctionCount() != null ? envFeatures.getJunctionCount() : 0,
                envFeatures.getSchoolCount() != null ? envFeatures.getSchoolCount() : 0,
                envFeatures.getHospitalCount() != null ? envFeatures.getHospitalCount() : 0,
                envFeatures.getRailwayCrossingCount() != null ? envFeatures.getRailwayCrossingCount() : 0,
                envFeatures.getBridgeCount() != null ? envFeatures.getBridgeCount() : 0,
                envFeatures.getTrafficSignalCount() != null ? envFeatures.getTrafficSignalCount() : 0,
                envFeatures.getPedestrianCrossingCount() != null ? envFeatures.getPedestrianCrossingCount() : 0,
                envFeatures.getStraightRoadPercentage() != null ? envFeatures.getStraightRoadPercentage().doubleValue() : 0.0,
                envFeatures.getWideRoadPercentage() != null ? envFeatures.getWideRoadPercentage().doubleValue() : 0.0,
                envFeatures.getUrbanPercentage() != null ? envFeatures.getUrbanPercentage().doubleValue() : 0.0
        );
    }

    @Override
    public WhatIfSimulationResponseDto simulateCountermeasures(WhatIfSimulationRequestDto request) {
        validateWhatIfRequest(request);

        RoadEnvironmentFeatures envFeatures = environmentFeaturesRepository.findBySegmentId(request.getSegmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No road environment survey data recorded for segment ID: " + request.getSegmentId()
                ));

        // Baseline (Actual survey record)
        EnvironmentRiskPredictionResponseDto baselineResult = executePrediction(
                request.getSegmentId(), request.getTimeCategory(),
                envFeatures.getJunctionCount() != null ? envFeatures.getJunctionCount() : 0,
                envFeatures.getSchoolCount() != null ? envFeatures.getSchoolCount() : 0,
                envFeatures.getHospitalCount() != null ? envFeatures.getHospitalCount() : 0,
                envFeatures.getRailwayCrossingCount() != null ? envFeatures.getRailwayCrossingCount() : 0,
                envFeatures.getBridgeCount() != null ? envFeatures.getBridgeCount() : 0,
                envFeatures.getTrafficSignalCount() != null ? envFeatures.getTrafficSignalCount() : 0,
                envFeatures.getPedestrianCrossingCount() != null ? envFeatures.getPedestrianCrossingCount() : 0,
                envFeatures.getStraightRoadPercentage() != null ? envFeatures.getStraightRoadPercentage().doubleValue() : 0.0,
                envFeatures.getWideRoadPercentage() != null ? envFeatures.getWideRoadPercentage().doubleValue() : 0.0,
                envFeatures.getUrbanPercentage() != null ? envFeatures.getUrbanPercentage().doubleValue() : 0.0
        );

        // Simulated (User overridden values, falling back to baseline if null)
        EnvironmentRiskPredictionResponseDto simulatedResult = executePrediction(
                request.getSegmentId(), request.getTimeCategory(),
                request.getJunctionCount() != null ? request.getJunctionCount() : (envFeatures.getJunctionCount() != null ? envFeatures.getJunctionCount() : 0),
                request.getSchoolCount() != null ? request.getSchoolCount() : (envFeatures.getSchoolCount() != null ? envFeatures.getSchoolCount() : 0),
                request.getHospitalCount() != null ? request.getHospitalCount() : (envFeatures.getHospitalCount() != null ? envFeatures.getHospitalCount() : 0),
                request.getRailwayCrossingCount() != null ? request.getRailwayCrossingCount() : (envFeatures.getRailwayCrossingCount() != null ? envFeatures.getRailwayCrossingCount() : 0),
                request.getBridgeCount() != null ? request.getBridgeCount() : (envFeatures.getBridgeCount() != null ? envFeatures.getBridgeCount() : 0),
                request.getTrafficSignalCount() != null ? request.getTrafficSignalCount() : (envFeatures.getTrafficSignalCount() != null ? envFeatures.getTrafficSignalCount() : 0),
                request.getPedestrianCrossingCount() != null ? request.getPedestrianCrossingCount() : (envFeatures.getPedestrianCrossingCount() != null ? envFeatures.getPedestrianCrossingCount() : 0),
                request.getStraightRoadPercentage() != null ? request.getStraightRoadPercentage() : (envFeatures.getStraightRoadPercentage() != null ? envFeatures.getStraightRoadPercentage().doubleValue() : 0.0),
                request.getWideRoadPercentage() != null ? request.getWideRoadPercentage() : (envFeatures.getWideRoadPercentage() != null ? envFeatures.getWideRoadPercentage().doubleValue() : 0.0),
                request.getUrbanPercentage() != null ? request.getUrbanPercentage() : (envFeatures.getUrbanPercentage() != null ? envFeatures.getUrbanPercentage().doubleValue() : 0.0)
        );

        boolean riskLevelChanged = !baselineResult.getPredictedRiskLevel().equalsIgnoreCase(simulatedResult.getPredictedRiskLevel());

        // Calculate probability delta for baseline predicted class
        Double baselineClassProb = baselineResult.getClassProbabilities() != null ? baselineResult.getClassProbabilities().get(baselineResult.getPredictedRiskLevel()) : 0.0;
        Double simulatedClassProb = simulatedResult.getClassProbabilities() != null ? simulatedResult.getClassProbabilities().get(baselineResult.getPredictedRiskLevel()) : 0.0;
        Double probDelta = (simulatedClassProb != null && baselineClassProb != null) ? Math.round((simulatedClassProb - baselineClassProb) * 100.0) / 100.0 : 0.0;

        return new WhatIfSimulationResponseDto(
                request.getSegmentId(),
                request.getTimeCategory(),
                riskLevelChanged,
                probDelta,
                baselineResult,
                simulatedResult
        );
    }

    private EnvironmentRiskPredictionResponseDto executePrediction(
            Integer segmentId, String timeCategory,
            int junctionCount, int schoolCount, int hospitalCount, int railwayCrossingCount,
            int bridgeCount, int trafficSignalCount, int pedestrianCrossingCount,
            double straightRoadPercentage, double wideRoadPercentage, double urbanPercentage
    ) {
        int schoolTime = ("06:00-09:00".equals(timeCategory) || "12:00-15:00".equals(timeCategory)) ? 1 : 0;
        int workRush = ("06:00-09:00".equals(timeCategory) || "15:00-18:00".equals(timeCategory) || "18:00-21:00".equals(timeCategory)) ? 1 : 0;

        Map<String, Object> fastApiRequest = new HashMap<>();
        fastApiRequest.put("segment_id", segmentId);
        fastApiRequest.put("time_category", timeCategory);
        fastApiRequest.put("school_time", schoolTime);
        fastApiRequest.put("work_rush", workRush);
        fastApiRequest.put("junction_count", junctionCount);
        fastApiRequest.put("school_count", schoolCount);
        fastApiRequest.put("hospital_count", hospitalCount);
        fastApiRequest.put("railway_crossing_count", railwayCrossingCount);
        fastApiRequest.put("bridge_count", bridgeCount);
        fastApiRequest.put("traffic_signal_count", trafficSignalCount);
        fastApiRequest.put("pedestrian_crossing_count", pedestrianCrossingCount);
        fastApiRequest.put("straight_road_percentage", straightRoadPercentage);
        fastApiRequest.put("wide_road_percentage", wideRoadPercentage);
        fastApiRequest.put("urban_percentage", urbanPercentage);

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
                segmentId,
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

    private volatile TemporalMapAllSlotsResponseDto cachedTemporalMapData = null;
    private volatile long lastCacheTime = 0L;
    private static final long CACHE_TTL_MS = 15 * 60 * 1000L; // 15 minutes TTL

    @Override
    public TemporalMapAllSlotsResponseDto getTemporalMapDataAllSlots() {
        long now = System.currentTimeMillis();
        if (cachedTemporalMapData != null && (now - lastCacheTime) < CACHE_TTL_MS) {
            return cachedTemporalMapData;
        }

        List<RoadSegment> segments = roadSegmentRepository.findAll();
        Map<Integer, RoadEnvironmentFeatures> envMap = new HashMap<>();
        environmentFeaturesRepository.findAll().forEach(env -> {
            if (env.getRoadSegment() != null) {
                envMap.put(env.getRoadSegment().getSegmentId(), env);
            }
        });

        Map<String, List<TemporalMapSegmentResponseDto>> timeSlotMap = new ConcurrentHashMap<>();

        VALID_TIME_CATEGORIES.parallelStream().forEach(timeCategory -> {
            List<TemporalMapSegmentResponseDto> segmentDtos = new ArrayList<>();

            for (RoadSegment segment : segments) {
                RoadEnvironmentFeatures env = envMap.get(segment.getSegmentId());

                String geomText = segment.getGeometry() != null ? segment.getGeometry().toText() : "";

                int jc = (env != null && env.getJunctionCount() != null) ? env.getJunctionCount() : 0;
                int sc = (env != null && env.getSchoolCount() != null) ? env.getSchoolCount() : 0;
                int hc = (env != null && env.getHospitalCount() != null) ? env.getHospitalCount() : 0;
                int rc = (env != null && env.getRailwayCrossingCount() != null) ? env.getRailwayCrossingCount() : 0;
                int bc = (env != null && env.getBridgeCount() != null) ? env.getBridgeCount() : 0;
                int ts = (env != null && env.getTrafficSignalCount() != null) ? env.getTrafficSignalCount() : 0;
                int pc = (env != null && env.getPedestrianCrossingCount() != null) ? env.getPedestrianCrossingCount() : 0;

                double str = (env != null && env.getStraightRoadPercentage() != null) ? env.getStraightRoadPercentage().doubleValue() : 0.0;
                double wde = (env != null && env.getWideRoadPercentage() != null) ? env.getWideRoadPercentage().doubleValue() : 0.0;
                double urb = (env != null && env.getUrbanPercentage() != null) ? env.getUrbanPercentage().doubleValue() : 0.0;

                try {
                    EnvironmentRiskPredictionResponseDto pred = executePrediction(
                            segment.getSegmentId(), timeCategory,
                            jc, sc, hc, rc, bc, ts, pc,
                            str, wde, urb
                    );

                    segmentDtos.add(new TemporalMapSegmentResponseDto(
                            segment.getSegmentId(),
                            geomText,
                            pred.getPredictedRiskLevel(),
                            pred.getClassProbabilities()
                    ));
                } catch (Exception e) {
                    segmentDtos.add(new TemporalMapSegmentResponseDto(
                            segment.getSegmentId(),
                            geomText,
                            "Low",
                            Map.of("Low", 100.0)
                    ));
                }
            }

            timeSlotMap.put(timeCategory, segmentDtos);
        });

        Map<String, List<TemporalMapSegmentResponseDto>> orderedSlotMap = new LinkedHashMap<>();
        for (String slot : VALID_TIME_CATEGORIES) {
            orderedSlotMap.put(slot, timeSlotMap.getOrDefault(slot, Collections.emptyList()));
        }

        TemporalMapAllSlotsResponseDto response = new TemporalMapAllSlotsResponseDto(orderedSlotMap);
        this.cachedTemporalMapData = response;
        this.lastCacheTime = now;

        return response;
    }

    private void validateWhatIfRequest(WhatIfSimulationRequestDto request) {
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
