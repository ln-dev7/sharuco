import React from "react"

export default function Error() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
        An error has occurred.
      </h1>
      <p className="text-lg text-gray-500">Please try again later.</p>
    </div>
  )
}
