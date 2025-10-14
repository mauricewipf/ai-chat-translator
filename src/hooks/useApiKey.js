import { useState } from 'react'

const API_KEY_STORAGE = 'openai_api_key'

export function useApiKey() {
    const [apiKey, setApiKey] = useState(() => {
        const storedKey = localStorage.getItem(API_KEY_STORAGE)
        return storedKey || import.meta.env.OPENAI_API_KEY || ''
    })

    const saveApiKey = (key) => {
        setApiKey(key)
        try { localStorage.setItem(API_KEY_STORAGE, key) } catch (_) { }
    }

    return { apiKey, saveApiKey }
}


