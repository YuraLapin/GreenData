import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'

import { useGoogleLogin } from '@react-oauth/google'
import useDrivePicker from 'react-google-drive-picker'

import credentials from '../credentials.js'


export default function GoogleUploadButton(props) {
    const [openPicker, authResponse] = useDrivePicker()
    const [pickedFolders, setFiles] = useState([])

    const SCOPES = credentials.scopes
    
    const CLIENT_ID = credentials.clientId
    const API_KEY = credentials.apiKey
    
    const APP_ID = credentials.appId

    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            props.setToken(tokenResponse.access_token)
            localStorage.setItem('token', tokenResponse.access_token)
            showPicker(tokenResponse.access_token)
        },
        scope: SCOPES,
    })

    function handleAuthClick() {
        if (props.token && props.token.length > 0) {
            showPicker(props.token)
        }
        else {
            login()
        }
    }

    function showPicker(token) {
        openPicker({
            clientId: CLIENT_ID,
            developerKey: API_KEY,
            appId: APP_ID,
            scopes: SCOPES,
            token: token,
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
        if (props.token && pickedFolders && pickedFolders.length > 0) {
            axios.post('/api/download', null, {
                params: {
                    accessToken: props.token,
                    folderId: pickedFolders[0].id,
                    filePath: props.filePath,
                },
            })
            .then(response => {
                console.log("Файл загружен на Google Диск:", response.data)
                alert("Файл успешно загружен на Google Диск!")
            })
            .catch(error => {
                console.error("Ошибка при загрузке файла:", error)
                alert("Ошибка при загрузке файла: " + error.message)
            })
        }
    }, [pickedFolders])

    return (
        <>
            <button onClick={handleAuthClick}>Download</button>
        </>
    )
}
