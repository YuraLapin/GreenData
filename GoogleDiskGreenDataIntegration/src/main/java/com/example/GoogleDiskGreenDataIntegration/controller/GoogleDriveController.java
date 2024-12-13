package com.example.GoogleDiskGreenDataIntegration.controller;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.services.drive.Drive;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;


import java.io.*;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class GoogleDriveController {

    private final String DOWNLOAD_DIR = "F:\\TEST";

    @PostMapping("/upload")
    public ResponseEntity<String> downloadFile(@RequestParam String fileId, @RequestParam String accessToken) {
        try {
            HttpTransport transport = GoogleNetHttpTransport.newTrustedTransport();
            JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();

            GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);

            Drive driveService = new Drive.Builder(transport, jsonFactory, credential)
                    .setApplicationName("GoogleDriveDownloader")
                    .build();

            Drive.Files.Get request = driveService.files().get(fileId);

            com.google.api.services.drive.model.File file = request.execute();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            request.executeMediaAndDownloadTo(outputStream);

            File localFile = new File(DOWNLOAD_DIR + "\\" + file.getName());

            try (FileOutputStream fileOutputStream = new FileOutputStream(localFile)) {
                outputStream.writeTo(fileOutputStream);
            }

            return ResponseEntity.ok("Файл скачан успешно в: " + localFile.getAbsolutePath());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка скачивания файла: " + e.getMessage());
        }
    }
}
