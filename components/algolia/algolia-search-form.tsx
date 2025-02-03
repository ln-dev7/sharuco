import { useAuthContext } from "@/context/AuthContext";
import { algoliasearch } from "algoliasearch";
import { Loader2, Search, Trash2 } from "lucide-react";
import { Highlight, Hits, InstantSearch, SearchBox } from "react-instantsearch";

import AlgoliaCopyright from "./algolia-copyright";

// https://www.algolia.com/doc/guides/building-search-ui/getting-started/react-hooks/#before-you-start

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string
);

export default function AlgoliaSearchForm() {
  const { user, userPseudo } = useAuthContext();

  const transformItems = (items) => {
    return items.filter((item) => item.idAuthor === userPseudo);
  };

  return (
    <InstantSearch indexName="forms" searchClient={client}>
      <AlgoliaCopyright />
      <SearchBox
        placeholder={`Search forms ...`}
        submitIconComponent={() => <Search className="h-4 w-4" />}
        resetIconComponent={() => <Trash2 />}
        loadingIconComponent={() => (
          <div className="w-full px-6 py-4">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </div>
        )}
        classNames={{
          root: "w-full mt-0 mb-3 rounded-none",
          form: "w-full relative rounded-none",
          input:
            "outline-none w-full rounded-none p-4 pl-12 text-sm text-gray-900 border border-x-0 border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
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
  );
}

function Hit({ hit }) {
  return (
    <a href={`/form/${hit.objectID}`}>
      <div className="mb-4 flex w-full flex-col items-start gap-2 overflow-hidden rounded-lg border p-4 hover:border-sky-500 dark:border-zinc-300 dark:hover:border-sky-500">
        <h2 className="text-lg font-semibold">{hit.name}</h2>
        <Highlight
          attribute="description"
          classNames={{
            root: "line-clamp-4 text-sm text-medium text-zinc-700 dark:text-zinc-300 ",
            highlighted: "bg-sky-500 text-white",
          }}
          hit={hit}
        />
        <span className="text-sm font-semibold">
          {hit.responses.length} response{hit.responses.length > 1 && "s"}
        </span>
      </div>
    </a>
  );
}
