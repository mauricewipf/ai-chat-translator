import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ArrowLeftRight } from 'lucide-react'

export function LanaguageEditSheet({ children, pairs, onRemovePair }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Edit language pairs</SheetTitle>
                </SheetHeader>

                <div className="mt-4 space-y-2">
                    {pairs?.map((pair) => (
                        <div key={pair.id} className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xl" role="img" aria-label={pair.source.name}>{pair.source.flag}</span>
                                <span className="text-sm">{pair.source.name}</span>
                                <ArrowLeftRight className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                                <span className="text-xl" role="img" aria-label={pair.target.name}>{pair.target.flag}</span>
                                <span className="text-sm">{pair.target.name}</span>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => onRemovePair?.(pair.id)}>Remove</Button>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}


