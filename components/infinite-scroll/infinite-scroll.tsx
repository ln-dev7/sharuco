import React from "react"
import { NBR_OF_CODES_PER_PAGE } from "@/constants/nbr-codes.js"
import InfiniteScroll from "react-infinite-scroll-component"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import CardCode from "@/components/cards/card-code"
import LoaderCode from "@/components/loaders/loader-code"

export default function InfiniteScrollComponent({
  currentData,
  fetchMorePublicCodes,
  isLoadingPublicCodes,
  hasMore,
  dataUser,
}) {
  return (
    <div>
      <InfiniteScroll
        dataLength={currentData.length}
        next={fetchMorePublicCodes}
        hasMore={!isLoadingPublicCodes && hasMore}
        loader={currentData.length >= NBR_OF_CODES_PER_PAGE && <LoaderCode />}
        className="scrollbar-hide"
        style={{
          overflow: "visible",
        }}
      >
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            659: 1,
            660: 1,
            720: 1,
            1200: 2,
          }}
          className="w-full"
        >
          <Masonry gutter="2rem">
            {currentData.map(
              (code: {
                id: string
                idAuthor: string
                language: string
                code: string
                description: string
                tags: string[]
                favoris: string[]
                isPrivate: boolean
                currentUser: any
                comments: any
              }) => (
                <CardCode
                  key={code.id}
                  id={code.id}
                  idAuthor={code.idAuthor}
                  language={code.language}
                  code={code.code}
                  description={code.description}
                  tags={code.tags}
                  favoris={code.favoris}
                  isPrivate={code.isPrivate}
                  currentUser={dataUser?.data}
                  comments={code.comments}
                />
              )
            )}
          </Masonry>
        </ResponsiveMasonry>
      </InfiniteScroll>
    </div>
  )
}
