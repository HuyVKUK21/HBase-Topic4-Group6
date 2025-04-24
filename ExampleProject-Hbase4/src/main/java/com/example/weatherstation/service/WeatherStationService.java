package com.example.weatherstation.service;

import com.example.weatherstation.adapter.HBaseExampleAdapter;
import com.example.weatherstation.model.Observation;
import com.example.weatherstation.model.Station;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.client.ResultScanner;
import org.apache.hadoop.hbase.client.Scan;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.util.Bytes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class WeatherStationService {
    private static final Logger logger = LoggerFactory.getLogger(WeatherStationService.class);
    
    private final HBaseExampleAdapter hbaseAdapter;
    private final Connection hbaseConnection;

    @Autowired
    public WeatherStationService(HBaseExampleAdapter hbaseAdapter, Connection hbaseConnection) {
        this.hbaseAdapter = hbaseAdapter;
        this.hbaseConnection = hbaseConnection;
    }

    @Cacheable("stationIds")
    public List<String> getAllStationIds() throws IOException {
        logger.debug("Fetching all station IDs");
        List<String> stationIds = new ArrayList<>();
        
        try (Table table = hbaseConnection.getTable(TableName.valueOf("stations"));
             ResultScanner scanner = table.getScanner(new Scan())) {
            
            for (Result result : scanner) {
                stationIds.add(Bytes.toString(result.getRow()));
            }
        }
        
        return stationIds;
    }

    @Cacheable("stations")
    public List<Station> getAllStations() throws IOException {
        logger.debug("Fetching all stations");
        List<String> stationIds = getAllStationIds();
        
        List<Station> stations = new ArrayList<>();
        for (String stationId : stationIds) {
            try {
                Map<String, String> stationInfo = hbaseAdapter.getStationInfo(stationId);
                if (stationInfo != null) {
                    stations.add(Station.fromMap(stationId, stationInfo));
                }
            } catch (Exception e) {
                logger.error("Error fetching station info for ID: {}", stationId, e);
                // Continue with the next station
            }
        }
        
        return stations;
    }

    @Cacheable(value = "stationInfo", key = "#stationId")
    public Station getStationInfo(String stationId) throws IOException {
        logger.debug("Fetching station info for ID: {}", stationId);
        Map<String, String> stationInfo = hbaseAdapter.getStationInfo(stationId);
        
        if (stationInfo == null || stationInfo.isEmpty()) {
            return null;
        }
        
        return Station.fromMap(stationId, stationInfo);
    }

    public List<Observation> getStationObservations(String stationId, long maxStamp, int maxCount) throws IOException {
        logger.debug("Fetching observations for station ID: {}, maxStamp: {}, maxCount: {}", stationId, maxStamp, maxCount);
        NavigableMap<Long, Integer> observationsMap = hbaseAdapter.getStationObservations(stationId, maxStamp, maxCount);
        
        return observationsMap.entrySet().stream()
                .map(entry -> new Observation(stationId, entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
    
    // For simulation purposes when HBase JAR is not available
    public List<Observation> generateSampleObservations(String stationId, int count) {
        List<Observation> observations = new ArrayList<>();
        long now = System.currentTimeMillis();
        
        for (int i = 0; i < count; i++) {
            // Generate a timestamp going back in time
            long timestamp = now - (i * 3600000); // Go back by hours
            
            // Generate a temperature between -30 and +40 degrees Celsius (multiplied by 10)
            int temp = (int) (Math.random() * 700) - 300;
            
            observations.add(new Observation(stationId, timestamp, temp));
        }
        
        return observations;
    }
}