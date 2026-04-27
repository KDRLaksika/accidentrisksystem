package com.accidentrisksystem.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.LineString;

@Getter
@Setter
@Entity
@Table(name = "road_segments")
public class RoadSegment {

    @Id
    @Column(name = "segment_id")
    private Integer segmentId;

    @Column(name = "geometry", columnDefinition = "geometry(LineString,32644)")
    private LineString geometry;
}