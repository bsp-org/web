import type { VerseData } from 'src/client/types.gen'

export default function Verse({ verse }: { verse: VerseData }) {
    return (
        <div>
            <b>{verse.book.display_name}</b> {verse.chapter}:{verse.verse}:{' '}
            <span dangerouslySetInnerHTML={{ __html: verse.text }} />
        </div>
    )
}
