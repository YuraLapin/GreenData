package com.example.GoogleDiskGreenDataIntegration.entity;

public class LoadedFile {
    private Long id;
    private String name;

    // Конструктор
    public LoadedFile(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    // Геттер для id
    public Long getId() {
        return id;
    }

    // Геттер для name
    public String getName() {
        return name;
    }

    // Сеттер для id
    public void setId(Long id) {
        this.id = id;
    }

    // Сеттер для name
    public void setName(String name) {
        this.name = name;
    }

    // Переопределение метода toString для удобства отображения
    @Override
    public String toString() {
        return "LoadedFile{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}