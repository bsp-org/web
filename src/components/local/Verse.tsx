import type { VerseData } from "src/client/types.gen";

export default function Verse ({verse}: {verse: VerseData}) {
    return <div><b>{verse.book.display_book_name}</b> {' '}{verse.chapter}:{verse.verse}: {verse.text}</div>
}