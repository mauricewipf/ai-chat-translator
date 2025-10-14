import { LanguagePairPopup } from '@/components/LanguagePairPopup'
import { Button } from '@/components/ui/button'
import { languagePairs } from '@/data/languagePairs'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react'

export function LanguagePairSelector({ selectedPair, onPairSelect }) {
    return (
        <div className="w-full overflow-x-auto">
            <div className="flex gap-3 min-w-max px-2 items-center">
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
                <LanguagePairPopup>
                    <Button variant="outline">
                        <Pencil className="w-4 h-4" />
                        Edit
                    </Button>
                </LanguagePairPopup>
            </div>
        </div>
    )
}

