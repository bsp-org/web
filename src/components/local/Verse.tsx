import type { VerseData } from 'src/client/types.gen'
import { cn } from 'src/lib/utils'

export default function Verse({
    verse,
    isSelected,
    onClick,
}: {
    verse: VerseData
    isSelected: boolean
    onClick: () => void
}) {
    return (
        <div
            className={cn(
                'cursor-pointer leading-7',
                isSelected ? 'decoration-dotted underline' : '',
            )}
            onClick={onClick}
        >
            <b>{verse.book.display_name}</b> {verse.chapter}:{verse.verse}:{' '}
            <span dangerouslySetInnerHTML={{ __html: verse.text }} />
        </div>
    )
}
