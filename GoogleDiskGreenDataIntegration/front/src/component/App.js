import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
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
        <>
            <GoogleUploadButton  tocken={token} setTocken={setToken}/>
            { greenDataFiles.map(file => {
                return (
                    <div key={file.id}>
                        <p>
                            <span>{ file.name } | </span>
                            <span>id = { file.id } </span>
                            <GoogleDownloadButton tocken={token} setTocken={setToken} id={file.id} />
                        </p>
                    </div>
                )
            }) }
            { token && token.length > 0 && <button onClick={logOut}>Log out</button> }
        </>
    )
}