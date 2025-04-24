package com.example.weatherstation.model;



import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Objects;

public class Observation {
    private String stationId;
    private long timestamp;
    private int temperature;  // in tenths of a degree Celsius

    public Observation() {
    }

    public Observation(String stationId, long timestamp, int temperature) {
        this.stationId = stationId;
        this.timestamp = timestamp;
        this.temperature = temperature;
    }

    public String getStationId() {
        return stationId;
    }

    public void setStationId(String stationId) {
        this.stationId = stationId;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public int getTemperature() {
        return temperature;
    }

    public void setTemperature(int temperature) {
        this.temperature = temperature;
    }

    public LocalDateTime getDateTime() {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZoneId.systemDefault());
    }

    public float getTemperatureCelsius() {
        return temperature / 10.0f;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Observation that = (Observation) o;
        return timestamp == that.timestamp && Objects.equals(stationId, that.stationId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(stationId, timestamp);
    }

    @Override
    public String toString() {
        return "Observation{" +
                "stationId='" + stationId + '\'' +
                ", timestamp=" + timestamp +
                ", temperature=" + temperature +
                '}';
    }
}