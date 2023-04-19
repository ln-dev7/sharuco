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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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
            "flex h-10 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
      <Card className="w-full mb-4 max-h-[200px] overflow-hidden">
        <CardHeader>
          <CardTitle>{hit.idAuthor}</CardTitle>
          <CardDescription>{hit.language}</CardDescription>
        </CardHeader>
        <CardContent>
          <Highlight attribute="description" hit={hit} />
        </CardContent>
      </Card>
    </Link>
  )
}
