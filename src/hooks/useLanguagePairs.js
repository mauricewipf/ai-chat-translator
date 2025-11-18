import { useEffect, useMemo, useState } from 'react'

const PAIRS_KEY = 'language_pair_ids'
const SELECTED_KEY = 'selected_language_pair_id'
const API_URL = import.meta.env.VITE_API_URL || ''

// Helper function to fetch language pairs from backend
async function fetchLanguagePairs() {
    try {
        const response = await fetch(`${API_URL}/api/language-pairs`)
        if (response.ok) {
            const data = await response.json()
            return data.pairIds
        }
    } catch (error) {
        console.error('Failed to fetch language pairs from backend:', error)
    }
    return null
}

// Helper function to save language pairs to backend
async function saveLanguagePairs(pairIds) {
    try {
        const response = await fetch(`${API_URL}/api/language-pairs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pairIds })
        })
        return response.ok
    } catch (error) {
        console.error('Failed to save language pairs to backend:', error)
        return false
    }
}

export function useLanguagePairs(languages) {
    const [pairIds, setPairIds] = useState(() => {
        try {
            const stored = localStorage.getItem(PAIRS_KEY)
            if (stored) return JSON.parse(stored)
        } catch (_) { }
        return []
    })

    const [isLoading, setIsLoading] = useState(true)

    const pairs = useMemo(() => {
        return (pairIds || [])
            .map((id) => {
                const [src, tgt] = id.split('-')
                const source = languages[src]
                const target = languages[tgt]
                if (!source || !target) return null
                return { id, source, target }
            })
            .filter(Boolean)
    }, [pairIds, languages])

    const [selectedPair, setSelectedPair] = useState(() => {
        try {
            const storedIds = localStorage.getItem(PAIRS_KEY)
            const ids = storedIds ? JSON.parse(storedIds) : []
            const storedId = localStorage.getItem(SELECTED_KEY)
            const effectiveId = storedId && ids.includes(storedId) ? storedId : (ids[0] || null)
            if (!effectiveId) return null
            const [src, tgt] = effectiveId.split('-')
            const source = languages[src]
            const target = languages[tgt]
            return source && target ? { id: effectiveId, source, target, reversed: false } : null
        } catch (_) {
            return null
        }
    })

    // Fetch language pairs from backend on mount
    useEffect(() => {
        async function loadPairs() {
            const fetchedPairs = await fetchLanguagePairs()
            if (fetchedPairs) {
                setPairIds(fetchedPairs)
                try { localStorage.setItem(PAIRS_KEY, JSON.stringify(fetchedPairs)) } catch (_) { }
            }
            setIsLoading(false)
        }
        loadPairs()
    }, [])

    // Save to both localStorage and backend when pairIds change
    useEffect(() => {
        if (!isLoading) {
            try { localStorage.setItem(PAIRS_KEY, JSON.stringify(pairIds)) } catch (_) { }
            saveLanguagePairs(pairIds)
        }
    }, [pairIds, isLoading])

    const onPairSelect = (pair) => {
        if (!pair) return
        if (selectedPair?.id === pair.id) {
            setSelectedPair({ ...pair, reversed: !selectedPair.reversed })
        } else {
            setSelectedPair({ ...pair, reversed: false })
        }
        try { localStorage.setItem(SELECTED_KEY, pair.id) } catch (_) { }
    }

    const onRemovePair = (id) => {
        setPairIds((prev) => {
            const next = prev.filter((pid) => pid !== id)
            setSelectedPair((prevSel) => {
                if (prevSel && prevSel.id === id) {
                    const newId = next[0]
                    if (!newId) return null
                    const [src, tgt] = newId.split('-')
                    const source = languages[src]
                    const target = languages[tgt]
                    const newSel = source && target ? { id: newId, source, target, reversed: false } : null
                    if (newSel?.id) {
                        try { localStorage.setItem(SELECTED_KEY, newSel.id) } catch (_) { }
                    }
                    return newSel
                }
                return prevSel
            })
            return next
        })
    }

    const onAddPair = (sourceCode, targetCode) => {
        const src = String(sourceCode || '').trim()
        const tgt = String(targetCode || '').trim()
        if (!src || !tgt) return
        if (!languages[src] || !languages[tgt]) return
        const id = `${src}-${tgt}`
        const reversedId = `${tgt}-${src}`
        setPairIds((prev) => {
            if (prev.includes(id) || prev.includes(reversedId)) return prev
            return [id, ...prev]
        })
    }

    return { pairs, selectedPair, onPairSelect, onRemovePair, onAddPair }
}


