package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.dto.request.PredictionRequestDto;
import com.accidentrisksystem.backend.dto.response.PredictionResponseDto;
import com.accidentrisksystem.backend.enums.RiskLevel;
import com.accidentrisksystem.backend.exception.BadRequestException;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.iservice.IPredictionService;
import com.accidentrisksystem.backend.repository.RoadSegmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PredictionService implements IPredictionService {

    private final RoadSegmentRepository roadSegmentRepository;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    @Override
    public PredictionResponseDto predict(PredictionRequestDto request) {

        validateRequest(request);

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> fastApiRequest = Map.of(
                "segment_id", request.getSegmentId(),
                "time_category", convertTimeCategory(request.getTimeCategory().name())
        );

        Map<String, Object> fastApiResponse = restTemplate.postForObject(
                mlServiceUrl,
                fastApiRequest,
                Map.class
        );

        if (fastApiResponse == null || !fastApiResponse.containsKey("predicted_risk_level")) {
            throw new BadRequestException("Invalid response from ML service");
        }

        String predictedRisk = fastApiResponse.get("predicted_risk_level").toString();

        RiskLevel riskLevel = RiskLevel.valueOf(predictedRisk.toUpperCase());

        return new PredictionResponseDto(riskLevel);
    }

    private void validateRequest(PredictionRequestDto request) {

        if (request.getSegmentId() == null) {
            throw new BadRequestException("Segment ID is required");
        }

        if (request.getTimeCategory() == null) {
            throw new BadRequestException("Time category is required");
        }

        boolean segmentExists = roadSegmentRepository.existsById(request.getSegmentId());

        if (!segmentExists) {
            throw new ResourceNotFoundException("Invalid segment ID. Segment does not exist");
        }
    }

    private String convertTimeCategory(String timeCategory) {

        return switch (timeCategory) {
            case "EARLY_MORNING" -> "Early Morning";
            case "MORNING" -> "Morning";
            case "DAYTIME" -> "Daytime";
            case "NIGHT" -> "Night";
            default -> throw new BadRequestException("Invalid time category");
        };
    }
}