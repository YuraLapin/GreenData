package com.example.GoogleDiskGreenDataIntegration.controller;

import com.example.GoogleDiskGreenDataIntegration.entity.LoadedFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class LoadedFilesController {
    private final String DOWNLOAD_DIR = "F:\\TEST"; // Путь к папке с файлами
    private List<LoadedFile> loadedFiles;

    public LoadedFilesController() {
        loadedFiles = new ArrayList<>();
        loadFilesFromDirectory();
    }

    private void loadFilesFromDirectory() {
        File directory = new File(DOWNLOAD_DIR);
        File[] files = directory.listFiles();

        if (files != null) {
            for (File file : files) {
                if (file.isFile()) {
                    loadedFiles.add(new LoadedFile(file.getName(), file.getAbsolutePath()));
                }
            }
        }
    }
    @GetMapping("/files")
    public List<LoadedFile> getAllFiles() {
        return loadedFiles;
    }
}
