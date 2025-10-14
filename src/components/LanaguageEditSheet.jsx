import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { languagePairs } from '@/data/languagePairs'

export function LanaguageEditSheet({ children }) {
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
                    {languagePairs.map((pair) => (
                        <div key={pair.id} className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xl" role="img" aria-label={pair.source.name}>{pair.source.flag}</span>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-xl" role="img" aria-label={pair.target.name}>{pair.target.flag}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {pair.source.name} to {pair.target.name}
                            </div>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}


