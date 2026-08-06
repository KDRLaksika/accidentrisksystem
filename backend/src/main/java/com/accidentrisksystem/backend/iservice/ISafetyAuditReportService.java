package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.dto.response.SafetyAuditReportDto;

public interface ISafetyAuditReportService {

    SafetyAuditReportDto generateAuditReport(Integer segmentId);
}
