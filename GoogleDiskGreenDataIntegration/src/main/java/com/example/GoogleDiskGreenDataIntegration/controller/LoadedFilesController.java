package com.example.GoogleDiskGreenDataIntegration.controller;

import com.example.GoogleDiskGreenDataIntegration.entity.LoadedFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class LoadedFilesController {
    List<LoadedFile> loadedFiles;
    public LoadedFilesController(){
        // Инициализируем список в конструкторе
        loadedFiles = new ArrayList<>();

        // Создаем и добавляем файлы в список
        LoadedFile f1 = new LoadedFile(1L, "Файл с бэка1");
        LoadedFile f2 = new LoadedFile(2L, "Файл с бэка2");
        LoadedFile f3 = new LoadedFile(3L, "Файл с бэка3");

        loadedFiles.add(f1);
        loadedFiles.add(f2);
        loadedFiles.add(f3);

    }
    @GetMapping("/files")
    public List<LoadedFile> getAllFiles(){
        return loadedFiles;
    }
    @GetMapping("/hello")
    public String Hello(){
        return "Hello from Spring Boot!";
    }

}
