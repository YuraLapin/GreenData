import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'

import { GoogleOAuthProvider } from '@react-oauth/google'

import credentials from '../credentials.js'

import GoogleUploadButton from './GoogleUploadButton'
import GoogleDownloadButton from './GoogleDownloadButton'


export default function App() {
    const [greenDataFiles, setGreenDataFiles] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'))

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('/api/files')
                setGreenDataFiles(response.data)
            } catch (error) {
                console.error("Ошибка при получении файлов: ", error)
            }
        };

        fetchFiles();
    }, [])

    function logOut() {
        localStorage.setItem('token', '')
        setToken('')
    }

    return (
        <GoogleOAuthProvider clientId={credentials.clientId}>
            <GoogleUploadButton  token={token} setToken={setToken}/>
            { greenDataFiles.map(file => {
                return (
                    <div key={file.path}>
                        <p>
                            <span>{ file.name } | </span>
                            <GoogleDownloadButton token={token} setToken={setToken} filePath={file.path} />
                        </p>
                    </div>
                )
            }) }
            { token && token.length > 0 && <button onClick={logOut}>Log out</button> }
        </GoogleOAuthProvider>
    )
}