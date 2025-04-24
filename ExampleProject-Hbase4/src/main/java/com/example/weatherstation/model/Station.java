package com.example.weatherstation.model;

import java.util.Map;
import java.util.Objects;

public class Station {
    private String id;
    private String name;
    private String location;
    private String description;

    public Station() {
    }

    public Station(String id, String name, String location, String description) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.description = description;
    }
    
    public static Station fromMap(String stationId, Map<String, String> stationInfo) {
        return new Station(
            stationId,
            stationInfo.getOrDefault("name", ""),
            stationInfo.getOrDefault("location", ""),
            stationInfo.getOrDefault("description", "")
        );
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Station station = (Station) o;
        return Objects.equals(id, station.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Station{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}