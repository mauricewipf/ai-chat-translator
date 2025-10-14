import { LanaguageEditSheet } from '@/components/LanaguageEditSheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react'

export function LanguagePairSelector({ selectedPair, onPairSelect, pairs, onRemovePair }) {
    return (
        <div className="w-full overflow-x-auto">
            <div className="flex gap-3 min-w-max px-2 items-center">
                {(pairs || []).map((pair) => {
                    const isSelected = selectedPair?.id === pair.id
                    const isReversed = selectedPair?.id === pair.id && selectedPair?.reversed

                    return (
                        <Button
                            variant="outline"
                            key={pair.id}
                            onClick={() => onPairSelect(pair)}
                            className={cn(
                                "gap-1 px-2 py-1 transition-all hover:shadow-md",
                                isSelected
                                    ? "border-primary bg-primary/10 border-2 shadow-sm"
                                    : ""
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
                        </Button>
                    )
                })}
                <LanaguageEditSheet pairs={pairs} onRemovePair={onRemovePair}>
                    <Button variant="outline">
                        <Pencil className="w-4 h-4" />
                        Edit
                    </Button>
                </LanaguageEditSheet>
            </div>
        </div>
    )
}

