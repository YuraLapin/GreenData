import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'

import { useGoogleLogin } from '@react-oauth/google'
import useDrivePicker from 'react-google-drive-picker'

import credentials from '../credentials.js'

import './GoogleUploadButton.css'


export default function GoogleUploadButton(props) {
    const [openPicker, authResponse] = useDrivePicker()
    const [pickedFiles, setFiles] = useState([])

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
        if (props.token && pickedFiles && pickedFiles.length > 0) {
            axios.post('/api/upload', null, {
                params: {
                    fileId: pickedFiles[0].id,
                    accessToken: props.token,
                }
            }).then(async () => {
                await props.fetchFiles()
            })
        }
    }, [pickedFiles])

    return (
        <>
            <button className="upload-button" onClick={handleAuthClick}>Загрузить</button>
        </>
    )
}
