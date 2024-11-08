import React from "react"
import { useState } from "react"
import GoogleUploadButton from "./GoogleUploadButton"
import GoogleDownloadButton from "./GoogleDownloadButton"

export default function App() {
    const [greenDataFiles, setGreenDataFiles] = useState([
        {
            name: "file1",
            id: "2",
        },
        {
            name: "file2",
            id: "2",
        },
        {
            name: "file3",
            id: "3",
        },
        {
            name: "file4",
            id: "4",
        },
        {
            name: "file5",
            id: "5",
        },
        {
            name: "file6",
            id: "6",
        },
    ])

    return (
        <>
            <GoogleUploadButton  />
            { greenDataFiles.map(file => {
                return (
                    <div>
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