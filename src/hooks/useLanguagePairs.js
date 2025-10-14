import { useEffect, useMemo, useState } from 'react'

const PAIRS_KEY = 'language_pair_ids'
const SELECTED_KEY = 'selected_language_pair_id'
const DEFAULT_PAIR_IDS = ['de-en', 'de-es', 'en-es', 'en-hu']

export function useLanguagePairs(languages) {
    const [pairIds, setPairIds] = useState(() => {
        try {
            const stored = localStorage.getItem(PAIRS_KEY)
            if (stored) return JSON.parse(stored)
        } catch (_) { }
        return DEFAULT_PAIR_IDS
    })

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
            const ids = storedIds ? JSON.parse(storedIds) : DEFAULT_PAIR_IDS
            const storedId = localStorage.getItem(SELECTED_KEY)
            const effectiveId = storedId && ids.includes(storedId) ? storedId : (ids[0] || null)
            if (!effectiveId) return null
            const [src, tgt] = effectiveId.split('-')
            const source = languages[src]
            const target = languages[tgt]
            return source && target ? { id: effectiveId, source, target, reversed: false } : null
        } catch (_) {
            const [src, tgt] = (DEFAULT_PAIR_IDS[0] || 'de-en').split('-')
            const source = languages[src]
            const target = languages[tgt]
            return source && target ? { id: `${src}-${tgt}`, source, target, reversed: false } : null
        }
    })

    useEffect(() => {
        try { localStorage.setItem(PAIRS_KEY, JSON.stringify(pairIds)) } catch (_) { }
    }, [pairIds])

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
            try { localStorage.setItem(PAIRS_KEY, JSON.stringify(next)) } catch (_) { }
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
            const next = [id, ...prev]
            try { localStorage.setItem(PAIRS_KEY, JSON.stringify(next)) } catch (_) { }
            return next
        })
    }

    return { pairs, selectedPair, onPairSelect, onRemovePair, onAddPair }
}


