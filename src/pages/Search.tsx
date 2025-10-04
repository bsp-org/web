import type { CheckedState } from '@radix-ui/react-checkbox'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
    getTranslationsApiTranslationsGetOptions,
    searchVersesApiSearchGetOptions,
} from 'src/client/@tanstack/react-query.gen'
import Verse from 'src/components/local/Verse'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import Combobox from 'src/components/ui/combobox'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'

export default function Search() {
    const [searchInputValue, setSearchInputValue] = useState('')
    const [searchText, setSearchText] = useState('')
    const [exactMatch, setExactMatch] = useState(false)
    const [translationId, setTranslationId] = useState('2cc25610')

    const searchQuery = useQuery({
        ...searchVersesApiSearchGetOptions({
            query: {
                q: searchText,
                translation_id: translationId,
                exact: exactMatch,
            },
        }),
        enabled: !!searchText && !!translationId,
    })

    const translationOptionsQuery = useQuery(
        getTranslationsApiTranslationsGetOptions(),
    )
    const translationList = translationOptionsQuery.data || []

    const translationOptions = translationList.map((translation) => ({
        value: translation.public_id,
        label: translation.abbreviation,
    }))

    return (
        <div>
            <div className='flex w-full justify-center'>
                <div className='flex'>
                    <Combobox
                        searchEnabled={false}
                        onChange={setTranslationId}
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
                    <div className='flex justify-center text-3xl font-bold mb-3 mt-10'>
                        Verses
                    </div>
                    <div className='flex justify-center'>
                        {!searchQuery.data && <span>No DATA</span>}
                        {searchQuery.data && (
                            <div>
                                {searchQuery.data.verses.map((item) => (
                                    <Verse
                                        key={`${item.book.book_id}-${item.chapter}-${item.verse}`}
                                        verse={item}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
