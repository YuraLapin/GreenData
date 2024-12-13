import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'
import credentials from '../credentials.js'
import useDrivePicker from 'react-google-drive-picker'

export default function GoogleUploadButton(props) {

    const [openPicker, authResponse] = useDrivePicker()
    const [pickedFolders, setFiles] = useState([])

    const SCOPES = credentials.scopes
    
    const CLIENT_ID = credentials.clientId
    const API_KEY = credentials.apiKey
    
    const APP_ID = credentials.appId

    function handleAuthClick() {
        openPicker({
            clientId: CLIENT_ID,
            developerKey: API_KEY,
            appId: APP_ID,
            scopes: SCOPES,
            token: props.tocken,
            viewId: 'FOLDERS',
            setSelectFolderEnabled: true,
            setIncludeFolders: true,
            setParentFolder: 'root',
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button')
                }
                setFiles(data.docs)
            },
        })
    }

    useEffect(() => {
        if (authResponse) {
            props.setTocken(authResponse.access_token)
            localStorage.setItem('token', authResponse.access_token)
        }
    }, [authResponse])

    useEffect(() => {
        if (pickedFolders && pickedFolders.length > 0) {
             axios.post('/api/download', {
                            token: props.token,
                            folderId: pickedFolders[0].id,
                            filePath: props.filePath, // Передаем путь к файлу
                        })
                        .then(response => {
                            console.log("Файл загружен на Google Диск:", response.data);
                            alert("Файл успешно загружен на Google Диск!");
                        })
                        .catch(error => {
                            console.error("Ошибка при загрузке файла:", error);
                            alert("Ошибка при загрузке файла: " + error.message);
                        });
        }
    }, [pickedFolders])

    return (
        <>
            <button onClick={handleAuthClick}>Download</button>
        </>
    )
}
