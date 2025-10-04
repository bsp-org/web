'use client'

import * as React from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'

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

export default function Combobox({
    options,
    placeholder,
    className,
    onChange,
    searchEnabled,
}: {
    options: { value: string; label: string }[]
    placeholder: string
    className: string
    onChange: (value: string) => void
    searchEnabled: boolean
}) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState('')

    React.useEffect(() => {
        onChange?.(value)
    }, [value, onChange])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className={cn('w-[200px] justify-between', className)}
                >
                    {value
                        ? options.find((option) => option.value === value)
                              ?.label
                        : placeholder}
                    <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    {searchEnabled && <CommandInput placeholder='Search...' />}
                    <CommandList>
                        <CommandEmpty>No options available.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        setValue(
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
