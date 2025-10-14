import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeftRight } from 'lucide-react'
import { useMemo, useState } from 'react'

export function LanguagePairAddForm({ languages, pairs, onAddPair }) {
    const languageList = useMemo(() => {
        const list = Object.values(languages || {})
        const priorityOrder = ['de', 'en', 'uk']
        const priorityIndex = new Map(priorityOrder.map((code, idx) => [code, idx]))
        return list.sort((a, b) => {
            const ai = priorityIndex.has(a.code) ? priorityIndex.get(a.code) : Infinity
            const bi = priorityIndex.has(b.code) ? priorityIndex.get(b.code) : Infinity
            if (ai !== bi) return ai - bi
            return a.name.localeCompare(b.name)
        })
    }, [languages])
    const languageKeys = useMemo(() => Object.keys(languages || {}), [languages])
    const defaultSrc = useMemo(() => (languages?.en ? 'en' : (languageKeys[0] || '')), [languages, languageKeys])
    const defaultTgt = useMemo(() => (languages?.de ? 'de' : (languageKeys.find((k) => k !== defaultSrc) || languageKeys[0] || '')), [languages, languageKeys, defaultSrc])

    const [srcCode, setSrcCode] = useState(defaultSrc)
    const [tgtCode, setTgtCode] = useState(defaultTgt)

    const pendingPairId = `${srcCode || ''}-${tgtCode || ''}`
    const reversedPendingPairId = `${tgtCode || ''}-${srcCode || ''}`
    const isDuplicate = !!pairs?.some((p) => p.id === pendingPairId || p.id === reversedPendingPairId)
    const isInvalid = !srcCode || !tgtCode || srcCode === tgtCode

    return (
        <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                    <Select value={srcCode} onValueChange={setSrcCode}>
                        <SelectTrigger className="h-9 min-w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {languageList.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <ArrowLeftRight className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                    <Select value={tgtCode} onValueChange={setTgtCode}>
                        <SelectTrigger className="h-9 min-w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {languageList.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isInvalid || isDuplicate}
                    onClick={() => onAddPair?.(srcCode, tgtCode)}
                >
                    Add
                </Button>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
                {isInvalid && <span>Select different source and target</span>}
            </div>
        </div>
    )
}


