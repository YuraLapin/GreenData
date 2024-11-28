import React from "react"
import { useState } from "react"
import { useEffect } from 'react';
import axios from 'axios';
import GoogleUploadButton from "./GoogleUploadButton"
import GoogleDownloadButton from "./GoogleDownloadButton"

export default function App() {
    const [greenDataFiles, setGreenDataFiles] = useState([
//        {
//            name: "file1",
//            id: "2",
//        },
//        {
//            name: "file2",
//            id: "2",
//        },
//        {
//            name: "file3",
//            id: "3",
//        },
//        {
//            name: "file4",
//            id: "4",
//        },
//        {
//            name: "file5",
//            id: "5",
//        },
//        {
//            name: "file6",
//            id: "6",
//        },
    ]);
    useEffect(() => {
            // Функция для получения файлов
            const fetchFiles = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/files'); // Убедитесь, что URL соответствует вашему бэкенду
                    setGreenDataFiles(response.data); // Обновляем состояние с полученными данными
                } catch (error) {
                    console.error("Ошибка при получении файлов:", error);
                }
            };

            fetchFiles(); // Вызов функции
        }, []); // Пустой массив зависимостей означает, что этот эффект выполнится только один раз при монтировании компонента

    return (
        <>
            <GoogleUploadButton  />
            { greenDataFiles.map(file => {
                return (
                    <div key={file.id}>
                        <p>
                            <span>{ file.name } | </span>
                            <span>id = { file.id } </span>
                            <GoogleDownloadButton id={file.id} />
                        </p>
                    </div>
                )
            }) }
        </>
    )
}