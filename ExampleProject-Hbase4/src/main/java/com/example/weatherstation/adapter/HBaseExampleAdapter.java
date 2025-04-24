// src/main/java/com/example/weatherstation/adapter/HBaseExampleAdapter.java
package com.example.weatherstation.adapter;

import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.Table;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.Map;
import java.util.NavigableMap;

@Component
public class HBaseExampleAdapter {
    private static final Logger logger = LoggerFactory.getLogger(HBaseExampleAdapter.class);
    
    private final Connection connection;
    private final Object stationQueryInstance;
    private final Object temperatureQueryInstance;
    
    private static final String STATION_QUERY_CLASS = "hbase.HBaseStationQuery";
    private static final String TEMPERATURE_QUERY_CLASS = "hbase.HBaseTemperatureQuery";
    
    @Autowired
    public HBaseExampleAdapter(Connection connection) {
        this.connection = connection;
        this.stationQueryInstance = initializeInstance(STATION_QUERY_CLASS);
        this.temperatureQueryInstance = initializeInstance(TEMPERATURE_QUERY_CLASS);
    }
    
    private Object initializeInstance(String className) {
        try {
            Class<?> clazz = Class.forName(className);
            
            // Thử tìm constructor nhận Connection
            try {
                Constructor<?> constructor = clazz.getDeclaredConstructor(Connection.class);
                return constructor.newInstance(connection);
            } catch (NoSuchMethodException e) {
                // Nếu không có constructor với Connection, sử dụng constructor mặc định
                logger.info("Class {} doesn't have a constructor with Connection parameter, using default constructor", className);
                return clazz.getDeclaredConstructor().newInstance();
            }
        } catch (Exception e) {
            logger.error("Failed to initialize HBase class: {}", className, e);
            throw new RuntimeException("HBase class initialization failed", e);
        }
    }
    
    @SuppressWarnings("unchecked")
    public Map<String, String> getStationInfo(String stationId) throws IOException {
        try (Table stationsTable = connection.getTable(TableName.valueOf("stations"))) {
            Method method = stationQueryInstance.getClass()
                .getMethod("getStationInfo", Table.class, String.class);
            
            return (Map<String, String>) method.invoke(
                stationQueryInstance,
                stationsTable,
                stationId
            );
        } catch (Exception e) {
            logger.error("Error retrieving station info for ID: {}", stationId, e);
            throw new IOException("HBase operation failed", e);
        }
    }
    
    @SuppressWarnings("unchecked")
    public NavigableMap<Long, Integer> getStationObservations(
            String stationId, 
            long maxStamp, 
            int maxCount) throws IOException {
        try (Table observationsTable = connection.getTable(TableName.valueOf("observations"))) {
            Method method = temperatureQueryInstance.getClass()
                .getMethod("getStationObservations", 
                    Table.class, 
                    String.class, 
                    long.class, 
                    int.class);
            
            return (NavigableMap<Long, Integer>) method.invoke(
                temperatureQueryInstance,
                observationsTable,
                stationId,
                maxStamp,
                maxCount
            );
        } catch (Exception e) {
            logger.error("Error retrieving observations for ID: {}", stationId, e);
            throw new IOException("HBase operation failed", e);
        }
    }
}