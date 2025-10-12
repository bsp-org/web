import type { CheckedState } from '@radix-ui/react-checkbox'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { find } from 'lodash'
import {
    getTranslationMetadataApiTranslationsTranslationIdMetadataGetOptions,
    getTranslationsApiTranslationsGetOptions,
    getVersesApiVersesGetOptions,
} from 'src/client/@tanstack/react-query.gen'
import Verse from 'src/components/local/Verse'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import Combobox from 'src/components/ui/combobox'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { parseAsBoolean, useQueryState, parseAsInteger } from 'nuqs'
import Spinner from 'src/components/local/Spinner'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'

export default function Search() {
    const [searchText, setSearchText] = useQueryState('search')
    const [exactMatch, setExactMatch] = useQueryState(
        'exact',
        parseAsBoolean.withDefault(true),
    )
    const [translationId, setTranslationId] = useQueryState('translation')
    const [searchInputValue, setSearchInputValue] = useState(searchText || '')
    const [currentPage, setCurrentPage] = useQueryState(
        'page',
        parseAsInteger.withDefault(1),
    )
    const [bookID, setBookID] = useQueryState('book', parseAsInteger)
    const [chapter, setChapter] = useQueryState('chapter', parseAsInteger)

    const searchQuery = useQuery({
        ...getVersesApiVersesGetOptions({
            query: {
                q: searchText,
                translation_id: translationId || '',
                book: bookID ? bookID.toString() : null,
                chapter: chapter ? chapter : null,
                exact: exactMatch,
                page: currentPage,
            },
        }),
        enabled: !!translationId && (!!searchText || !!bookID),
    })

    useEffect(() => {
        setCurrentPage(1)
    }, [searchText, translationId, exactMatch])

    useEffect(() => {
        setChapter(null)
    }, [bookID])

    const translationOptionsQuery = useQuery(
        getTranslationsApiTranslationsGetOptions(),
    )
    const translationList = translationOptionsQuery.data || []

    const translationOptions = translationList.map((translation) => ({
        value: translation.public_id,
        label: translation.abbreviation,
    }))

    const translationMetadataQuery = useQuery({
        ...getTranslationMetadataApiTranslationsTranslationIdMetadataGetOptions(
            {
                path: {
                    translation_id: translationId || '',
                },
            },
        ),
        enabled: !!translationId,
    })

    const bookList = translationMetadataQuery.data?.books || []

    const bookOptions = bookList.map((book) => ({
        value: book.id.toString(),
        label: book.display_name,
    }))

    const currentBook = find(bookList, (book) => book.id === bookID)

    const chapterOptions =
        currentBook?.chapters.map((chapter) => ({
            value: chapter.chapter.toString(),
            label: chapter.chapter.toString(),
        })) || []

    if (
        translationOptionsQuery.isLoading ||
        translationMetadataQuery.isLoading
    ) {
        return <Spinner />
    }

    return (
        <div>
            <div className='flex w-full justify-center'>
                <div className='flex flex-col w-full max-w-4xl justify-center items-center'>
                    <div className='flex mb-3'>
                        <div className='flex items-center mr-3'>
                            <Checkbox
                                id='exact-match-checkbox'
                                checked={exactMatch}
                                onCheckedChange={(checked: CheckedState) => {
                                    setExactMatch(
                                        checked === 'indeterminate'
                                            ? false
                                            : checked,
                                    )
                                }}
                            />
                            <Label
                                className='ml-1'
                                htmlFor='exact-match-checkbox'
                            >
                                Exact
                            </Label>
                        </div>
                        <div className='flex relative'>
                            <Input
                                value={searchInputValue}
                                onChange={(e) => {
                                    setSearchInputValue(e.target.value)
                                }}
                                className='w-90 mr-2 h-12 pr-12'
                                placeholder='Type something'
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setSearchText(searchInputValue)
                                    }
                                }}
                            />
                            <Button
                                disabled={
                                    !translationId ||
                                    (!searchInputValue && !searchText)
                                }
                                onClick={() => {
                                    setSearchText(searchInputValue)
                                }}
                                className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer h-10 w-10 rounded-full'
                            >
                                <MagnifyingGlassIcon size={32} />
                            </Button>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <Combobox
                            searchEnabled={false}
                            clearable={false}
                            value={translationId || ''}
                            onChange={(value) => {
                                if (value) {
                                    setTranslationId(value)
                                }
                            }}
                            placeholder='Select translation'
                            options={translationOptions}
                        />
                        <Combobox
                            searchEnabled={true}
                            clearable={true}
                            value={bookID ? bookID.toString() : ''}
                            onChange={(value) => {
                                if (value) {
                                    setBookID(parseInt(value))
                                } else {
                                    setBookID(null)
                                }
                            }}
                            options={bookOptions}
                            placeholder='Select book'
                        />
                        <Combobox
                            searchEnabled={true}
                            clearable={true}
                            value={chapter ? chapter.toString() : ''}
                            onChange={(value) => {
                                if (value) {
                                    setChapter(parseInt(value))
                                } else {
                                    setChapter(null)
                                }
                            }}
                            options={chapterOptions}
                            placeholder='Select chapter'
                        />
                    </div>
                </div>
            </div>
            <div className='flex w-full justify-center'>
                <div className='flex-col w-200 justify-center'>
                    <div className='flex justify-center text-3xl font-bold mb-1 mt-10'>
                        Verses
                    </div>
                    <div className='flex justify-center'>
                        {!searchQuery.data?.verses && (
                            <div className='flex justify-center text-gray-500'>
                                No DATA
                            </div>
                        )}
                        {searchQuery.data?.verses && (
                            <div>
                                <span className='flex text-gray-500 mb-'>
                                    {searchQuery.data.pagination.total_items}{' '}
                                    verses found
                                </span>
                                {searchQuery.data?.verses.map((verse) => (
                                    <Verse
                                        key={`${verse.book.id}-${verse.chapter}-${verse.verse}`}
                                        verse={verse}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    {searchQuery.data &&
                        searchQuery.data.pagination.total_pages > 1 && (
                            <div className='flex justify-center gap-4 mt-10 mb-10'>
                                <div className='flex'>
                                    <Button
                                        className='cursor-pointer'
                                        disabled={
                                            searchQuery.data?.pagination
                                                .previous === null
                                        }
                                        onClick={() => {
                                            setCurrentPage(currentPage - 1)
                                        }}
                                    >
                                        Previous
                                    </Button>
                                </div>
                                <div className='flex'>
                                    <span className='text-gray-500 content-center'>
                                        {currentPage}
                                    </span>
                                </div>
                                <div className='flex'>
                                    <Button
                                        className='cursor-pointer'
                                        disabled={
                                            searchQuery.data?.pagination
                                                .next === null
                                        }
                                        onClick={() => {
                                            setCurrentPage(currentPage + 1)
                                        }}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}
