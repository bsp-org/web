'use client'

import * as React from 'react'
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react'
import { cn } from 'src/lib/utils'
import { Button } from 'src/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from 'src/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from 'src/components/ui/popover'
import { filter, includes, toLower } from 'lodash'

interface ComboboxProps {
    options: { value: string; label: string }[]
    placeholder: string
    className?: string
    value: string
    onChange: (value: string) => void
    searchEnabled?: boolean
    clearable?: boolean
}

export default function Combobox({
    options,
    placeholder,
    className,
    value,
    onChange,
    searchEnabled = true,
    clearable = true,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const selectedOption = options.find((option) => option.value === value)
    const [searchValue, setSearchValue] = React.useState('')

    const filteredOptions = searchValue
        ? filter(options, (option) => {
              return includes(toLower(option.label), toLower(searchValue))
          })
        : options

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className={cn(
                        'min-w-[200px] justify-between relative',
                        className,
                    )}
                >
                    <span className='truncate'>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>

                    <div className='flex items-center gap-1'>
                        {clearable && value && (
                            <span
                                className='cursor-pointer'
                                onClick={(e) => {
                                    onChange('')
                                    e.stopPropagation()
                                }}
                            >
                                <XIcon className='h-4 w-4 opacity-60 hover:opacity-100 cursor-pointer z-10 cursor-pointer' />
                            </span>
                        )}
                        <ChevronsUpDownIcon className='h-4 w-4 opacity-50' />
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className='min-w-[200px] p-0'>
                <Command shouldFilter={false}>
                    {searchEnabled && options.length > 3 && (
                        <CommandInput
                            placeholder='Search...'
                            value={searchValue}
                            onValueChange={setSearchValue}
                        />
                    )}
                    <CommandList>
                        <CommandEmpty>
                            {searchEnabled
                                ? 'No matches found.'
                                : 'No options available.'}
                        </CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        onChange(
                                            currentValue === value
                                                ? ''
                                                : currentValue,
                                        )
                                        setOpen(false)
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === option.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
