import Link from "next/link"
import algoliasearch from "algoliasearch"
import { SearchIcon, Trash2 } from "lucide-react"
import {
  Highlight,
  Hits,
  InstantSearch,
  SearchBox,
} from "react-instantsearch-hooks-web"

import Loader from "@/components/loader"
import LoaderCode from "@/components/loader-code"

// https://www.algolia.com/doc/guides/building-search-ui/getting-started/react-hooks/#before-you-start

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
)

export default function AlgoliaSearch() {
  return (
    <InstantSearch indexName="codes" searchClient={client}>
      <SearchBox
        placeholder="Search codes here..."
        submitIconComponent={() => (
          <SearchIcon className="absolute top-0 right-0 bottom-0 w-6" />
        )}
        resetIconComponent={() => (
          <Trash2 className="absolute top-0 right-0 bottom-0 w-6" />
        )}
        loadingIconComponent={() => <LoaderCode />}
        classNames={{
          root: "w-full mt-6 mb-3",
          form: "w-full relative",
          input:
            "outline-none w-full p-4 text-sm text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          submit: "hidden",
          reset: "hidden",
        }}
      />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  )
}

function Hit({ hit }) {
  return (
    <Link href={`/code-preview/${hit.objectID}`}>
      <div className="w-full mb-4 p-4 rounded-lg border hover:border-sky-500 dark:border-slate-300 dark:hover:border-sky-500 overflow-hidden">
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold leading-none tracking-tight text-slate-700 dark:text-slate-300 ">
            {hit.idAuthor}
          </h3>
          <p className="text-sm text-muted-foreground text-slate-700 dark:text-slate-300 ">
            {hit.language}
          </p>
        </div>
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
    </Link>
  )
}
