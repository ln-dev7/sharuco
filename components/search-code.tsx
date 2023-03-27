import React from 'react'
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export default function SearchCode() {
  return (
    <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
    <Input
      type="text"
      placeholder="Search code with description"
      className="w-full"
    />
    <Select>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Select a languages" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Languages</SelectLabel>
          {/*  */}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
  )
}
