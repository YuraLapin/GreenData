import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'
import credentials from '../credentials.js'
import useDrivePicker from 'react-google-drive-picker'

export default function GoogleUploadButton(props) {

    const [openPicker, authResponse] = useDrivePicker()
    const [pickedFiles, setFiles] = useState([])

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
        if (pickedFiles && pickedFiles.length > 0) {
            axios.post('/api/upload', {
                token: props.tocken,
                fileId: pickedFiles[0].id,
            })
        }
    }, [pickedFiles])

    return (
        <>
            <button onClick={handleAuthClick}>Upload</button>
        </>
    )
}
