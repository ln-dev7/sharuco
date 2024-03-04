import algoliasearch from "algoliasearch"
import { Search, Trash2 } from "lucide-react"
import { Highlight, Hits, InstantSearch, SearchBox } from "react-instantsearch"

import LoaderCode from "@/components/loaders/loader-code"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AlgoliaCopyright from "./algolia-copyright"

// https://www.algolia.com/doc/guides/building-search-ui/getting-started/react-hooks/#before-you-start

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
)

export default function AlgoliaSearchCode() {
  return (
    <InstantSearch indexName="codes" searchClient={client}>
      <AlgoliaCopyright />
      <SearchBox
        placeholder="Search publics codes..."
        submitIconComponent={() => <Search className="h-4 w-4" />}
        resetIconComponent={() => <Trash2 />}
        loadingIconComponent={() => (
          <div className="w-full px-6 py-4">
            <LoaderCode />
          </div>
        )}
        classNames={{
          root: "w-full mt-0 mb-3 rounded-none",
          form: "w-full relative rounded-none",
          input:
            "outline-none w-full rounded-none p-4 pl-12 text-sm text-gray-900 border border-x-0 border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          submit: "absolute left-[14px] top-[19px]",
          reset: "hidden",
        }}
      />
      <Hits className="px-6" hitComponent={Hit} />
    </InstantSearch>
  )
}

function Hit({ hit }) {
  return (
    <a href={`/code-preview/${hit.objectID}`}>
      <div className="mb-4 w-full overflow-hidden rounded-lg border p-4 hover:border-sky-500 dark:border-slate-300 dark:hover:border-sky-500">
        <div className="flex flex-col items-start">
          <h3 className="mb-2 text-lg font-semibold leading-none tracking-tight text-slate-700 dark:text-slate-300 ">
            {hit.idAuthor}
          </h3>
          <Badge variant="outline">{hit.language}</Badge>
        </div>
        <Separator className="my-2" />
        <div>
          <Highlight
            attribute="description"
            classNames={{
              root: "text-sm text-muted-foreground text-slate-700 dark:text-slate-300 ",
              highlighted: "bg-sky-500 text-white",
            }}
            hit={hit}
          />
        </div>
      </div>
    </a>
  )
}
