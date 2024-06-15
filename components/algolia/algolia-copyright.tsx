import React from "react"

export default function AlgoliaCopyright() {
  return (
    <div className="px-4 pt-4">
      <a
        className="flex items-center text-sm text-gray-500 dark:text-gray-400"
        href="https://www.algolia.com/ref/docsearch/?utm_source=sharuco.lndev.me&amp;utm_medium=referral&amp;utm_content=powered_by&amp;utm_campaign=docsearch"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="">Search by</span>
        <img
          src="/assets/algolia.svg"
          alt="Algolia"
          className="ml-1 h-4 w-auto"
        />
      </a>
    </div>
  )
}
