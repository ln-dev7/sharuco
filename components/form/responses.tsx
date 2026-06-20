"use client"

import { useParams } from "next/navigation"
import { useUpdateFormDocument } from "@/firebase/firestore/updateFormDocument"
import copyToClipboard from "@/utils/copyToClipboard"
import formatDateTime from "@/utils/formatDateTime"
import algoliasearch from "algoliasearch"
import jsPDF from "jspdf"
import { Loader2, MessageSquare, Timer, Trash } from "lucide-react"
import moment from "moment"

import EmptyCard from "@/components/empty-card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export default function ResponsesForms({ dataForm }: { dataForm: any }) {
  const params = useParams()

  const { toast } = useToast()

  const ALGOLIA_INDEX_NAME = "forms"

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(ALGOLIA_INDEX_NAME)

  const { updateFormDocument, isLoading: isLoadingUpdateForm }: any =
    useUpdateFormDocument("forms")

  const handleDeleteResponse = async (idResponse: string) => {
    const updatedFormData: {
      responses: any[]
    } = {
      responses: [
        ...dataForm.responses.filter(
          (response: any) => response.idResponse !== idResponse
        ),
      ],
    }

    const id = params["form"]

    await updateFormDocument({ id, updatedFormData })

    await index.partialUpdateObject({
      objectID: id,
      responses: updatedFormData.responses,
    })
  }

  // GENERATE PDF

  const generatePDF = (dataForm) => {
    const pdf = new jsPDF()

    pdf.setFontSize(16)
    pdf.text(dataForm.name, 10, 10)
    pdf.setFontSize(12)
    pdf.text(dataForm.description, 10, 20)

    let yPos = 40

    pdf.setFontSize(12)
    pdf.text(`Total Responses: ${dataForm.responses.length}`, 150, 30)

    dataForm.responses
      .slice()
      .reverse()
      .forEach((response, index) => {
        pdf.setFontSize(12)
        pdf.text(`Response ${index + 1}`, 10, yPos)
        yPos += 10

        pdf.setFontSize(10)
        pdf.text(
          `Created At : ${new Date(response.createdAt).toLocaleString()}`,
          15,
          yPos
        )
        yPos += 10

        response.responses.forEach((res) => {
          if (yPos + 25 > pdf.internal.pageSize.height - 25) {
            pdf.addPage() // Ajoute une nouvelle page si nécessaire
            yPos = 15 // Réinitialise la position Y pour la nouvelle page
          }
          if (
            res.type === "divider" ||
            res.type === "image" ||
            res.type === "video" ||
            res.type === "audio" ||
            res.type === "embed"
          ) {
            // skip layout/embed blocks in the PDF
            return
          } else if (res.type === "heading" || res.type === "paragraph") {
            pdf.text(`${res.label}`, 15, yPos)
          } else {
            const value = res.text || "(no answer)"
            const line = pdf.splitTextToSize(
              `${res.label}: ${value}`,
              pdf.internal.pageSize.width - 30
            )
            pdf.text(line, 15, yPos)
            yPos += 8 * (line.length - 1)
          }
          yPos += 8
        })

        // Dessiner une barre noire après chaque réponse
        pdf.setDrawColor(0) // Couleur de la bordure (noir)
        pdf.setLineWidth(0.15) // Largeur de la bordure
        pdf.rect(10, yPos, pdf.internal.pageSize.width - 20, 0.5, "S")
        yPos += 1 // Ajuste la position Y pour la prochaine section

        yPos += 10
      })

    pdf.setFontSize(10)
    pdf.textWithLink("Powered by SHARUCO FORM", 10, yPos + 10, {
      url: "https://sharuco.lndev.me/forms",
    })

    // Preview the PDF in a new tab
    pdf.output("dataurlnewwindow")
  }

  return (
    <>
      {dataForm.responses && dataForm.responses.length > 0 ? (
        <div className="w-full space-y-4">
          <Button onClick={() => generatePDF(dataForm)}>Generate PDF</Button>
          {dataForm.responses
            .slice()
            .reverse()
            .map((response) => (
              <div
                className="flex w-full flex-col items-start gap-4 rounded-md border border-dashed border-zinc-300 p-4 dark:border-zinc-700"
                key={response.idResponse}
              >
                <Accordion
                  type="single"
                  collapsible
                  className="w-full border-b border-dashed border-zinc-300 dark:border-zinc-700"
                >
                  <AccordionItem value="response" className="border-none">
                    <AccordionTrigger>
                      <div className="flex items-center justify-start gap-2">
                        View response
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex w-full flex-col items-start gap-2">
                        {response.responses.map((answer, answerIndex) => {
                          // Layout blocks
                          if (answer.type === "heading") {
                            return (
                              <h3
                                className="text-xl font-semibold"
                                key={answerIndex}
                              >
                                {answer.label}
                              </h3>
                            )
                          }
                          if (answer.type === "paragraph") {
                            return (
                              <p
                                className="text-sm text-zinc-600 dark:text-zinc-300"
                                key={answerIndex}
                              >
                                {answer.label}
                              </p>
                            )
                          }
                          if (answer.type === "divider") {
                            return (
                              <Separator key={answerIndex} className="my-1 w-full" />
                            )
                          }
                          // Embed blocks carry no answer — don't show them
                          if (
                            answer.type === "image" ||
                            answer.type === "video" ||
                            answer.type === "audio" ||
                            answer.type === "embed"
                          ) {
                            return null
                          }

                          const isUrl =
                            typeof answer.text === "string" &&
                            /^https?:\/\//.test(answer.text)
                          const isImage =
                            answer.type === "signature" ||
                            (isUrl && /\.(png|jpe?g|gif|webp|svg)$/i.test(answer.text))

                          return (
                            <div
                              className="flex w-full flex-col items-start gap-2 rounded-md bg-zinc-100 p-4 dark:bg-zinc-800"
                              key={answerIndex}
                            >
                              <Label>{answer.label}</Label>

                              {answer.type === "signature" && answer.text ? (
                                <img
                                  src={answer.text}
                                  alt="signature"
                                  className="max-h-32 rounded-md border bg-white"
                                />
                              ) : answer.type === "fileupload" && isUrl ? (
                                <a
                                  href={answer.text}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-semibold text-blue-600 underline underline-offset-2 dark:text-blue-400"
                                >
                                  Download file
                                </a>
                              ) : isImage ? (
                                <img
                                  src={answer.text}
                                  alt={answer.label}
                                  className="max-h-32 rounded-md border"
                                />
                              ) : (
                                <div className="flex w-full items-center justify-between gap-4">
                                  {isUrl ? (
                                    <a
                                      href={answer.text}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="font-semibold break-all text-blue-600 underline underline-offset-2 dark:text-blue-400"
                                    >
                                      {answer.text}
                                    </a>
                                  ) : (
                                    <p className="font-semibold break-words">
                                      {answer.text || (
                                        <span className="font-normal text-zinc-400 italic">
                                          (no answer)
                                        </span>
                                      )}
                                    </p>
                                  )}
                                  {answer.text && (
                                    <span
                                      className="block shrink-0 cursor-pointer underline underline-offset-2"
                                      onClick={() => {
                                        copyToClipboard(answer.text)
                                        toast({
                                          title: `"${answer.text}" copied to clipboard`,
                                          description:
                                            "You can paste it wherever you want",
                                          action: (
                                            <ToastAction altText="Okay">
                                              Okay
                                            </ToastAction>
                                          ),
                                        })
                                      }}
                                    >
                                      copy
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-400">
                    <Timer className="mr-1.5 h-4 w-4" />
                    <span className="text-sm font-medium">
                      {formatDateTime(moment(response.createdAt).toDate())}
                    </span>
                  </span>
                  <Button
                    variant="destructive"
                    className="text-semibold flex items-center justify-center gap-2 rounded-md px-4 text-white"
                    disabled={isLoadingUpdateForm}
                    onClick={() => {
                      if (!isLoadingUpdateForm) {
                        handleDeleteResponse(response.idResponse)
                      }
                    }}
                  >
                    {isLoadingUpdateForm ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <EmptyCard
          icon={<MessageSquare className="h-8 w-8" />}
          title="No responses yet"
          description="Responses to your form will appear here"
        />
      )}
    </>
  )
}
