import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const languagePairs = [
    {
        id: 'de-en',
        source: { code: 'de', name: 'German', flag: '🇩🇪' },
        target: { code: 'en', name: 'English', flag: '🇬🇧' }
    },
    {
        id: 'de-es',
        source: { code: 'de', name: 'German', flag: '🇩🇪' },
        target: { code: 'es', name: 'Spanish', flag: '🇪🇸' }
    },
    {
        id: 'de-hu',
        source: { code: 'de', name: 'German', flag: '🇩🇪' },
        target: { code: 'hu', name: 'Hungarian', flag: '🇭🇺' }
    },
    {
        id: 'de-uk',
        source: { code: 'de', name: 'German', flag: '🇩🇪' },
        target: { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' }
    },
    {
        id: 'en-es',
        source: { code: 'en', name: 'English', flag: '🇬🇧' },
        target: { code: 'es', name: 'Spanish', flag: '🇪🇸' }
    },
    {
        id: 'en-hu',
        source: { code: 'en', name: 'English', flag: '🇬🇧' },
        target: { code: 'hu', name: 'Hungarian', flag: '🇭🇺' }
    }
]

export function LanguagePairSelector({ selectedPair, onPairSelect }) {
    return (
        <div className="w-full overflow-x-auto">
            <div className="flex gap-3 min-w-max px-2">
                {languagePairs.map((pair) => {
                    const isSelected = selectedPair?.id === pair.id
                    const isReversed = selectedPair?.id === pair.id && selectedPair?.reversed

                    return (
                        <button
                            key={pair.id}
                            onClick={() => onPairSelect(pair)}
                            className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-lg border-2 transition-all hover:shadow-md",
                                isSelected
                                    ? "border-primary bg-primary/10 shadow-sm"
                                    : "border-border bg-background hover:border-primary/50"
                            )}
                        >
                            <span className="text-2xl" role="img" aria-label={pair.source.name}>
                                {pair.source.flag}
                            </span>

                            {isReversed ? (
                                <ArrowLeft className="w-5 h-5 text-primary" />
                            ) : (
                                <ArrowRight className="w-5 h-5 text-primary" />
                            )}

                            <span className="text-2xl" role="img" aria-label={pair.target.name}>
                                {pair.target.flag}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

