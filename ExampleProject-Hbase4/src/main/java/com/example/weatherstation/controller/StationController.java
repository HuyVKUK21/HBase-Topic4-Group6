package com.example.weatherstation.controller;

import com.example.weatherstation.model.Observation;
import com.example.weatherstation.model.Station;
import com.example.weatherstation.service.WeatherStationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stations")
public class StationController {
    private static final Logger logger = LoggerFactory.getLogger(StationController.class);

    private final WeatherStationService weatherStationService;

    @Autowired
    public StationController(WeatherStationService weatherStationService) {
        this.weatherStationService = weatherStationService;
    }

    @GetMapping
    public ResponseEntity<List<Station>> getAllStations() {
        try {
            List<Station> stations = weatherStationService.getAllStations();
            return ResponseEntity.ok(stations);
        } catch (IOException e) {
            logger.error("Error retrieving all stations", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{stationId}")
    public ResponseEntity<Station> getStationById(@PathVariable String stationId) {
        try {
            Station station = weatherStationService.getStationInfo(stationId);
            if (station != null) {
                return ResponseEntity.ok(station);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            logger.error("Error retrieving station with ID: {}", stationId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{stationId}/observations")
    public ResponseEntity<List<Observation>> getStationObservations(
            @PathVariable String stationId,
            @RequestParam(required = false, defaultValue = "9223372036854775807") long maxStamp,
            @RequestParam(required = false, defaultValue = "10") int limit) {
        
        try {
            // Try to get real observations from HBase
            List<Observation> observations = weatherStationService.getStationObservations(stationId, maxStamp, limit);
            return ResponseEntity.ok(observations);
        } catch (Exception e) {
            logger.error("Error retrieving observations from HBase, falling back to sample data", e);
            
            // Fall back to sample data if HBase access fails
            List<Observation> sampleObservations = weatherStationService.generateSampleObservations(stationId, limit);
            return ResponseEntity.ok(sampleObservations);
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Station>> searchStations(@RequestParam String query) {
        try {
            List<Station> stations = weatherStationService.getAllStations();
            
            // If query is empty, return all stations
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.ok(stations);
            }
            
            // Filter stations by name (case-insensitive, trimming spaces)
            String normalizedQuery = query.trim().toLowerCase();
            List<Station> filteredStations = stations.stream()
                .filter(station -> station.getName().trim().toLowerCase().contains(normalizedQuery))
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(filteredStations);
        } catch (IOException e) {
            logger.error("Error searching stations with query: {}", query, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    
}