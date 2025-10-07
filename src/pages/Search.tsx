import type { CheckedState } from '@radix-ui/react-checkbox'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
    getTranslationsApiTranslationsGetOptions,
    getVersesApiVersesGetOptions,
} from 'src/client/@tanstack/react-query.gen'
import type { TranslationInfo } from 'src/client/types.gen'
import Verse from 'src/components/local/Verse'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import Combobox from 'src/components/ui/combobox'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { parseAsBoolean, useQueryState, parseAsInteger } from 'nuqs'
import Spinner from 'src/components/local/Spinner'

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

    const searchQuery = useQuery({
        ...getVersesApiVersesGetOptions({
            query: {
                q: searchText,
                translation_ids: translationId || '',
                exact: exactMatch,
                page: currentPage,
            },
        }),
        enabled: !!searchText && !!translationId,
    })

    useEffect(() => {
        setCurrentPage(1)
    }, [searchText, translationId, exactMatch])

    const translationOptionsQuery = useQuery(
        getTranslationsApiTranslationsGetOptions(),
    )
    const translationList = translationOptionsQuery.data || []

    const translationOptions = translationList.map((translation) => ({
        value: translation.public_id,
        label: translation.abbreviation,
    }))

    const translationsById = translationList.reduce(
        (acc, translation) => {
            acc[translation.public_id] = translation
            return acc
        },
        {} as Record<string, TranslationInfo>,
    )

    if (translationOptionsQuery.isLoading) {
        return <Spinner />
    }

    return (
        <div>
            <div className='flex w-full justify-center'>
                <div className='flex'>
                    <Combobox
                        searchEnabled={false}
                        value={translationId || ''}
                        onChange={(value) => {
                            if (value) {
                                setTranslationId(value)
                            }
                        }}
                        className='mr-2'
                        placeholder='Select translation'
                        options={translationOptions}
                    />
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
                        <Label className='ml-1' htmlFor='exact-match-checkbox'>
                            Exact Match
                        </Label>
                    </div>
                    <Input
                        value={searchInputValue}
                        onChange={(e) => {
                            setSearchInputValue(e.target.value)
                        }}
                        className='w-50 mr-2'
                        placeholder='Type something'
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setSearchText(searchInputValue)
                            }
                        }}
                    />
                    <Button
                        disabled={!searchInputValue || !translationId}
                        onClick={() => {
                            setSearchText(searchInputValue)
                        }}
                    >
                        Search
                    </Button>
                </div>
            </div>
            <div className='flex w-full justify-center'>
                <div className='flex-col w-200 justify-center'>
                    <div className='flex justify-center text-3xl font-bold mb-1 mt-10'>
                        Verses
                    </div>
                    <div className='flex justify-center'>
                        {searchQuery.data?.results && (
                            <div>
                                <span className='text-gray-500'>
                                    {searchQuery.data.pagination.total_items} verses found
                                </span>
                                {searchQuery.data.results.map((translation) => (
                                    <div key={translation.translation_id}>
                                        <div className='text-center text-lg font-bold mb-4'>
                                            {
                                                translationsById[
                                                    translation.translation_id
                                                ]?.full_name
                                            }
                                        </div>
                                        {!translation.verses.length && (
                                            <div className='flex justify-center text-gray-500'>
                                                No DATA
                                            </div>
                                        )}
                                        {translation.verses.map((verse) => (
                                            <Verse
                                                key={`${verse.book.id}-${verse.chapter}-${verse.verse}`}
                                                verse={verse}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {searchQuery.data?.pagination.total_pages && searchQuery.data.pagination.total_pages > 1 && (
                        <div className='flex justify-center gap-4 mt-10 mb-10'>
                        <div className='flex'>
                            <Button
                                disabled={
                                    searchQuery.data?.pagination.previous ===
                                    null
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
                                disabled={
                                    searchQuery.data?.pagination.next === null
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
