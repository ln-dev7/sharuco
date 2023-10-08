"use client"

import { useAuthContext } from "@/context/AuthContext"
import { useGetDocumentFromUser } from "@/firebase/firestore/getDocumentFromUser"
import { FileCog, Layers } from "lucide-react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import CardForm from "@/components/cards/card-form"
import EmptyCard from "@/components/empty-card"
import LoaderForms from "@/components/loaders/loader-forms"

export default function FormsConnected() {
  const { user, userPseudo } = useAuthContext()

  const {
    isLoading: isLoadingForms,
    isError: isErrorForms,
    data: dataForms,
  } = useGetDocumentFromUser(userPseudo, "forms")

  return (
    <>
      {isLoadingForms && <LoaderForms />}
      {dataForms && (
        <>
          {dataForms.length > 0 && (
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                659: 1,
                660: 2,
                720: 2,
                990: 3,
              }}
              className="w-full"
            >
              <Masonry gutter="2rem">
                {dataForms.map(
                  (form: {
                    id: string
                    idAuthor: string
                    name: string
                    description: string
                    color: string
                    responses: any[]
                    createdAt: any
                  }) => (
                    <CardForm
                      key={form.id}
                      id={form.id}
                      idAuthor={form.idAuthor}
                      name={form.name}
                      description={form.description}
                      color={form.color}
                      responses={form.responses}
                      createdAt={form.createdAt}
                    />
                  )
                )}
              </Masonry>
            </ResponsiveMasonry>
          )}
          {dataForms.length == 0 && (
            <EmptyCard
              icon={<Layers className="h-12 w-12" />}
              title="No form found"
              description="You have not added any form yet."
            />
          )}
        </>
      )}
      {isErrorForms && (
        <EmptyCard
          icon={<FileCog className="h-12 w-12" />}
          title="An error has occurred"
          description="An error has occurred, please try again later or refresh the page."
        />
      )}
    </>
  )
}
