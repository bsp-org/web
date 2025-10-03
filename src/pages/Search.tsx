import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { searchVersesApiSearchGetOptions } from 'src/client/@tanstack/react-query.gen'
import Verse from 'src/components/local/Verse'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'

export default function Search() {
    const [searchInputValue, setSearchInputValue] = useState('')
    const [searchText, setSearchText] = useState('')

    const searchQuery = useQuery({
        ...searchVersesApiSearchGetOptions({
            query: {
                q: searchText,
                translation_id: '2cc25610',
            },
        }),
        queryKey: ['search', searchText],
        enabled: !!searchText,
    })

    return (
        <div>
            <div className='flex w-full justify-center'>
                <div className='flex'>
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
