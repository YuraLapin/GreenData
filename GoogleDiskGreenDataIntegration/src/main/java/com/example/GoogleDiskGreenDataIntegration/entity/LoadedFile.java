package com.example.GoogleDiskGreenDataIntegration.entity;

public class LoadedFile {
    private String name;
    private String path;

    public LoadedFile(String name, String path) {
        this.name = name;
        this.path = path;
    }

    public String getName() {
        return name;
    }

    public String getPath() {
        return path;
    }
}