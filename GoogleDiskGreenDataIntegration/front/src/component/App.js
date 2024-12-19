import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'

import { GoogleOAuthProvider } from '@react-oauth/google'

import credentials from '../credentials.js'

import GoogleUploadButton from './GoogleUploadButton'
import GoogleDownloadButton from './GoogleDownloadButton'

import './App.css'


export default function App() {
    const [greenDataFiles, setGreenDataFiles] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'))

    const [enableUpload, setEnableUpload] = useState(localStorage.getItem('enableUpload') === 'true' ?? false)
    const [enableDownload, setEnableDownload] = useState(localStorage.getItem('enableDownload') ==='true' ?? false)

    async function fetchFiles() {
        try {
            const response = await axios.get('/api/files')
            setGreenDataFiles(response.data)
        } catch (error) {
            console.error("Ошибка при получении файлов: ", error)
        }
    }

    function logOut() {
        localStorage.setItem('token', '')
        setToken('')
    }

    function toggleUpload() {
        localStorage.setItem('enableUpload', !enableUpload)
        setEnableUpload(!enableUpload)
    }

    function toggleDownload() {
        localStorage.setItem('enableDownload', !enableDownload)
        setEnableDownload(!enableDownload)
    }

    useEffect(() => {
        fetchFiles()
    }, [])

    return (
        <GoogleOAuthProvider clientId={credentials.clientId}>
            <div className="outer-wrapper">
                <div className="group-wrapper settings-wrapper">
                    <div>
                        <input type="checkbox" checked={enableUpload} onChange={toggleUpload}></input>
                        <label>Включить скачивание с GoogleDrive</label>
                    </div>

                    <div>
                        <input type="checkbox" checked={enableDownload} onChange={toggleDownload}></input>
                        <label>Включить загрузку на GoogleDrive</label>
                    </div>
                </div>
                <div className="group-wrapper files-wrapper">
                    {enableUpload && <GoogleUploadButton token={token} setToken={setToken} fetchFiles={fetchFiles} /> }
                    <table>
                        { greenDataFiles.map(file => {
                            return (
                                <tr key={file.path}>
                                    <td><span>{ file.name }</span></td>
                                    <td>{ enableDownload && <GoogleDownloadButton token={token} setToken={setToken} filePath={file.path} /> }</td>
                                </tr>
                            )
                        }) }
                    </table>
                    { token && token.length > 0 && <button className="log-out-button" onClick={logOut}>Выйти</button> }
                </div>
            </div>
        </GoogleOAuthProvider>
    )
}
