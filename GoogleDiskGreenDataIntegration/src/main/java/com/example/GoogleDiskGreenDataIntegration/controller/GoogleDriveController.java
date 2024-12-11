package com.example.GoogleDiskGreenDataIntegration.controller;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.services.drive.Drive;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.io.*;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class GoogleDriveController {

    private final String DOWNLOAD_DIR = "Z:\\GreenDataProject\\09,12\\GreenData\\GoogleDiskGreenDataIntegration\\src\\main\\resources"; // Path to the local storage

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
            

            File localFile = new File(DOWNLOAD_DIR + "/" + "123");
            OutputStream outputStream = new FileOutputStream(localFile);
            request.executeMediaAndDownloadTo(outputStream);
            outputStream.close(); 

            return ResponseEntity.ok("File downloaded successfully to: " + localFile.getAbsolutePath());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to download the file: " + e.getMessage());
        }
    }
}
