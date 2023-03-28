import { useState } from "react"
import { useGetCodesByDescription } from "@/firebase/firestore/getCodesWithDescription"
import { useGetCodesWithLanguage } from "@/firebase/firestore/getCodesWithLanguage"

import { Button } from "@/components/ui/button"
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

export default function SearchCode({ dataCodes }: { dataCodes: any }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchLanguage, setSearchLanguage] = useState("")

  const {
    isLoading: isLoadingCodesWithDescription,
    isError: isErrorCodesWithDescription,
    data: dataCodesWithDescription,
  } = useGetCodesByDescription(searchTerm)

  const {
    isLoading: isLoadingCodesWithLanguage,
    isError: isErrorCodesWithLanguage,
    data: dataCodesWithLanguage,
  } = useGetCodesWithLanguage(searchLanguage)

  return (
    <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Search code with description"
          className="w-full"
        />
        <Button type="submit">Search</Button>
      </div>
      <Select>
        <SelectTrigger className="w-full sm:w-[240px]">
          <SelectValue placeholder="Select a languages" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            {dataCodes && (
              <>
                {dataCodes
                  .map((code: any) => code.language)
                  .filter(
                    (language: any, index: any, self: any) =>
                      self.indexOf(language) === index
                  )
                  .map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
              </>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
