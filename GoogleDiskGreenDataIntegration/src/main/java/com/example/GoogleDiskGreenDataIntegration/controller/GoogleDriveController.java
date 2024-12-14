package com.example.GoogleDiskGreenDataIntegration.controller;

import com.google.api.client.http.FileContent;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.services.drive.Drive;

import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collections;


import java.io.*;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class GoogleDriveController {

    private final String DOWNLOAD_DIR = "C:/TEST";
    private final String CREDENTIALS_PATH = "C:/CRED/credentials.json";

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

            java.io.File localFile = new java.io.File(DOWNLOAD_DIR + "\\" + file.getName());

            try (FileOutputStream fileOutputStream = new FileOutputStream(localFile)) {
                outputStream.writeTo(fileOutputStream);
            }

            return ResponseEntity.ok("Файл скачан успешно в: " + localFile.getAbsolutePath());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка скачивания файла: " + e.getMessage());
        }
    }

    @PostMapping("/download")
    public ResponseEntity<String> uploadFile(@RequestParam String accessToken, @RequestParam String folderId, @RequestParam String filePath) {
        try {
            // Настройка Google Drive API
            // JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();
            // GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream(CREDENTIALS_PATH))
            //         .createScoped(Arrays.asList(DriveScopes.DRIVE_FILE));
            // HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credentials);

            // Drive driveService = new Drive.Builder(new NetHttpTransport(), jsonFactory, requestInitializer)
            //         .setApplicationName("GoogleDriveUploader")
            //         .build();

            HttpTransport transport = GoogleNetHttpTransport.newTrustedTransport();
            JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();
            GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);

            Drive driveService = new Drive.Builder(transport, jsonFactory, credential)
                    .setApplicationName("GoogleDriveDownloader")
                    .build();

            // Создание метаданных файла
            com.google.api.services.drive.model.File fileMetadata = new com.google.api.services.drive.model.File();
            fileMetadata.setName(Paths.get(filePath).getFileName().toString());
            fileMetadata.setParents(java.util.Collections.singletonList(folderId));

            // Загрузка файла
            java.io.File filePathToUpload = new java.io.File(filePath);
            String mimeType = Files.probeContentType(filePathToUpload.toPath()); // Определяем MIME-тип файла
            FileContent mediaContent = new FileContent(mimeType, filePathToUpload);

            // Выполнение загрузки файла с указанием uploadType=media
            com.google.api.services.drive.model.File uploadedFile = driveService.files().create(fileMetadata, mediaContent)
                    .setFields("id")
                    .set("uploadType", "media") // Устанавливаем uploadType
                    .set("supportsAllDrives", true)
                    .execute();

            return ResponseEntity.ok("Файл загружен на Google Диск с ID: " + uploadedFile.getId());
        } catch (GoogleJsonResponseException e) {
            System.err.println("Ошибка загрузки файла: " + e.getDetails());
            return ResponseEntity.status(400).body("Ошибка загрузки файла: " + e.getDetails());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка загрузки файла: " + e.getMessage());
        }
    }
}
