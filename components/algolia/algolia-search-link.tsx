import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"
import algoliasearch from "algoliasearch"
import { Search, SearchIcon, Trash2 } from "lucide-react"
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  SearchBox,
} from "react-instantsearch"

import LoaderLink from "@/components/loaders/loader-link"
import { Badge } from "@/components/ui/badge"

// https://www.algolia.com/doc/guides/building-search-ui/getting-started/react-hooks/#before-you-start

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
)

export default function AlgoliaSearchLink() {
  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName.toLowerCase()

  const transformItems = (items) => {
    return items.filter((item) => item.idAuthor === pseudo)
  }

  return (
    <InstantSearch indexName="links" searchClient={client}>
      <SearchBox
        placeholder="Search links..."
        submitIconComponent={() => <Search className="w-4 h-4" />}
        resetIconComponent={() => <Trash2 />}
        loadingIconComponent={() => (
          <div className="w-full px-6 py-4">
            <LoaderLink />
          </div>
        )}
        classNames={{
          root: "w-full mt-12 mb-3 rounded-none",
          form: "w-full relative rounded-none",
          input:
            "outline-none w-full rounded-none p-4 pl-12 text-sm text-gray-900 border border-x-0 border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          submit: "absolute left-[14px] top-[19px]",
          reset: "hidden",
        }}
      />
      <Hits
        className="px-6"
        hitComponent={Hit}
        transformItems={transformItems}
      />
      {/* <Configure filters="" analytics={false} /> */}
    </InstantSearch>
  )
}

function Hit({ hit }) {
  return (
    <Link href={`${hit.link}`} target="_blank">
      <div className="w-full mb-4 p-4 rounded-lg border hover:border-sky-500 dark:border-slate-300 dark:hover:border-sky-500 overflow-hidden flex items-start flex-col gap-2">
        <div>
          <Highlight
            attribute="description"
            classNames={{
              root: "line-clamp-4 text-sm text-medium text-slate-700 dark:text-slate-300 ",
              highlighted: "bg-sky-500 text-white",
            }}
            hit={hit}
          />
        </div>
        {hit.tags.length > 0 && (
          <div className="flex items-center justify-start gap-2">
            {hit.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <Link
          href={`${hit.link}`}
          className="line-clamp-1 text-xs text-sky-500 font-medium"
          target="_blank"
        >
          {hit.link}
        </Link>
      </div>
    </Link>
  )
}