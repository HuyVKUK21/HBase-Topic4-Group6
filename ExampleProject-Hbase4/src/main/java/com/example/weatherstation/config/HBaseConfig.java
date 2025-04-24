package com.example.weatherstation.config;

import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class HBaseConfig {

    @Value("${hbase.zookeeper.quorum:192.168.32.1}")
    private String zookeeperQuorum;

    @Value("${hbase.zookeeper.property.clientPort:2181}")
    private String zookeeperClientPort;

    @Bean
    public org.apache.hadoop.conf.Configuration hbaseConfiguration() {
        org.apache.hadoop.conf.Configuration configuration = HBaseConfiguration.create();
        configuration.set("hbase.zookeeper.quorum", zookeeperQuorum);
        configuration.set("hbase.zookeeper.property.clientPort", zookeeperClientPort);
        
        configuration.set("hbase.client.ipc.pool.size", "5"); // Kích thước pool
        configuration.set("hbase.client.ipc.pool.type", "RoundRobin");
       
        return configuration;
    }

    @Bean
    public Connection hbaseConnection() throws IOException {
        return ConnectionFactory.createConnection(hbaseConfiguration());
    }
}