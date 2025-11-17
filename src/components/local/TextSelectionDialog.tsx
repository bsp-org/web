import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Command } from 'src/components/ui/command'
import {
    Dialog,
    DialogPortal,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from 'src/components/ui/dialog'
import type { VerseData } from 'src/client/types.gen'
import { groupBy, map, sortBy, range, keyBy } from 'lodash'
import { CopySimpleIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'

interface TextSelectionDialogProps {
    open: boolean
    selectedVerses: { [key: string]: VerseData }
}

function summarizeSequence(versesNumbers: number[]) {
    if (!versesNumbers.length) return []

    const result = versesNumbers.reduce<Array<[number, number?]>>((acc, num, i) => {
        // Start of a new range
        if (i === 0) acc.push([num])
        // Continue consecutive run
        else if (num === versesNumbers[i - 1]! + 1) {
            const last = acc.at(-1)
            if (last) last[1] = num
        }
        // Start new run
        else acc.push([num])
        return acc
    }, [])

    return result.map(([start, end]) => ({
        start,
        end,
        displayValue: end ? `${start}-${end}` : `${start}`,
    }))
}

export default function TextSelectionDialog({
    open,
    selectedVerses,
}: TextSelectionDialogProps) {
    const [copyButtonText, setCopyButtonText] = useState('Copy')

    const groupedByBook = groupBy(
        selectedVerses,
        (verse) => `${verse.book.display_name} ${verse.chapter}`,
    )

    const textToCopy = Object.entries(groupedByBook)
        .map(([bookAndChapter, verses]) => {
            const versesByNumber = keyBy(verses, 'verse')

            const summary = summarizeSequence(
                sortBy(verses, 'verse').map((verse) => verse.verse),
            ).map(({ start, end, displayValue }) => {
                const stop = end ? end + 1 : start + 1
                const versesToCopy = map(
                    range(start, stop),
                    (num) => versesByNumber[num],
                ).filter((verse): verse is VerseData => verse !== undefined)
                const versesText = map(
                    versesToCopy,
                    (verse) => `${verse.verse}. ${verse.text}`,
                ).join(' ')

                return `${bookAndChapter}:${displayValue}\n${versesText} \n`
            })

            return summary.join('\n')
        })
        .join('\n')

    const groupedByBookText = Object.entries(groupedByBook).map(
        ([bookAndChapter, verses]) => {
            const summary = summarizeSequence(
                sortBy(verses, 'verse').map((verse) => verse.verse),
            )
                .map(({ displayValue }) => displayValue)
                .join(',')
            return `${bookAndChapter}:${summary}`
        },
    )

    useEffect(() => {
        setCopyButtonText('Copy')
    }, [selectedVerses])

    return (
        <Dialog open={open} modal={false}>
            <DialogHeader className='sr-only'>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <DialogPortal data-slot='dialog-portal'>
                <DialogPrimitive.Content
                    data-slot='dialog-content'
                    className='bg-background shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom fixed bottom-0 left-[50%] z-50 grid w-full max-w-80 translate-x-[-50%] mb-4 gap-4 rounded-lg shadow-lg duration-200 overflow-hidden p-0 outline-none ring-0'
                >
                    <Command className='p-3 bg-stone-600 text-white shadow-lg pt-2 pb-2 pl-2 pr-1'>
                        <div className=''>
                            <div className='flex justify-between mb-1'>
                                <div className='text-lg font-bold flex items-center'>
                                    Selected text
                                </div>
                                <Button
                                    className='cursor-pointer'
                                    variant='secondary'
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            textToCopy,
                                        )
                                        setCopyButtonText('Copied')
                                    }}
                                >
                                    <CopySimpleIcon size={24} />
                                    {copyButtonText}
                                </Button>
                            </div>

                            <div className='max-h-40 overflow-y-auto w-full'>
                                {groupedByBookText.map((text) => (
                                    <div key={text}>{text}</div>
                                ))}
                            </div>
                        </div>
                    </Command>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    )
}
