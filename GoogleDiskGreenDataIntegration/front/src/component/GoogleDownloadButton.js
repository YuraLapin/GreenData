import React from "react"
import { useEffect, useState } from "react"
import credentials from "../credentials.js"


export default function GoogleDownloadButton(props) {
    useEffect(() => {
        const script = document.createElement('script')

        script.src = 'https://apis.google.com/js/api.js'
        script.async = true
        script.defer = true
        script.onload = onApiLoad

        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    useEffect(() => {
        const script = document.createElement('script')

        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = gisLoaded

        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])
    
    let [tokenClient, setTokenClient] = useState()
    let [accessToken, setAccessToken] = useState(null)
    let [pickerInited, setPickerInited] = useState(false)
    let [gisInited, setGisInited] = useState(false)
    

    const SCOPES = credentials.scopes
    
    const CLIENT_ID = credentials.clientId
    const API_KEY = credentials.apiKey
    
    const APP_ID = credentials.appId

    
    function onApiLoad() {
        gapi.load('picker', onPickerApiLoad)
    }
    
    function onPickerApiLoad() {
        setPickerInited(true)
    }
    
    function gisLoaded() {
        let token = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '',
        })

        setTokenClient(token)
        setGisInited(true)
    }
    
    async function createPicker() {
        const view = new google.picker.View(google.picker.ViewId.DOCS)
        view.setMimeTypes('image/png,image/jpeg,image/jpg')
        const picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setDeveloperKey(API_KEY)
            .setAppId(APP_ID)
            .setOAuthToken(accessToken)
            .addView(view)
            .addView(new google.picker.DocsUploadView())
            .setCallback(pickerCallback)
            .build()
        picker.setVisible(true)
    }
    
    async function pickerCallback(data) {
        if (data.action === google.picker.Action.PICKED) {
            let text = `Picker response: \n${JSON.stringify(data, null, 2)}\n`
            const document = data[google.picker.Response.DOCUMENTS][0]
            const fileId = document[google.picker.Document.ID]
            console.log(fileId)
            const res = await gapi.client.drive.files.get({
                'fileId': fileId,
                'fields': '*',
            })
            text += `Drive API response for first document: \n${JSON.stringify(res.result, null, 2)}\n`
            alert(text)
        }
    }
    
    async function handleAuthClick() {
        tokenClient.callback = async (response) => {
            if (response.error !== undefined) {
                throw (response)
            }
    
            setAccessToken(response.access_token)
            await createPicker()
        }
    
        if (accessToken === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            tokenClient.requestAccessToken({prompt: 'consent'})
        }
        
        else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient.requestAccessToken({prompt: ''})
        }
    }

    return (
        <>
            { (gisInited && pickerInited) && <button onClick={handleAuthClick}>Download</button> }
        </>
    )
}

