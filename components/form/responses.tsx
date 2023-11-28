"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  allLanguages,
  getExtensionByName,
  languagesName,
} from "@/constants/languages"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogout } from "@/firebase/auth/githubLogout"
import { useCreateDocument } from "@/firebase/firestore/createDocument"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useGetDocumentFromUser } from "@/firebase/firestore/getDocumentFromUser"
import { useGetFavoriteCode } from "@/firebase/firestore/getFavoriteCode"
import { useGetIsPrivateCodeFromUser } from "@/firebase/firestore/getIsPrivateCodeFromUser"
import { useUpdateFormDocument } from "@/firebase/firestore/updateFormDocument"
import copyToClipboard from "@/utils/copyToClipboard.js"
import embedProject from "@/utils/embedStackblitzProject"
import formatDateTime from "@/utils/formatDateTime.js"
import indentCode from "@/utils/indentCode.js"
import linearizeCode from "@/utils/linearizeCode"
import { yupResolver } from "@hookform/resolvers/yup"
import sdk, { Project } from "@stackblitz/sdk"
import algoliasearch from "algoliasearch"
import hljs from "highlight.js"
import jsPDF from "jspdf"
import {
  Calendar,
  CircleDot,
  DollarSign,
  Eye,
  EyeOff,
  FileCog,
  FileQuestion,
  Heart,
  LinkIcon,
  List,
  ListChecks,
  Loader2,
  MessageSquare,
  Plus,
  Save,
  Send,
  Settings,
  Timer,
  Trash,
  Type,
  User,
  View,
} from "lucide-react"
import moment from "moment"
import { useFieldArray, useForm } from "react-hook-form"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import * as yup from "yup"

import { TemplateName } from "@/types/templatStackblitzName"
import { cn } from "@/lib/utils"
import CardCode from "@/components/cards/card-code"
import CardCodeAdmin from "@/components/cards/card-code-admin"
import EmptyCard from "@/components/empty-card"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import LoaderCodes from "@/components/loaders/loader-codes"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export default function ResponsesForms({ dataForm }: { dataForm: any }) {
  const params = useParams()
  const { user, userPseudo } = useAuthContext()
  const router = useRouter()

  const { toast } = useToast()

  const notifyUrlCopied = () =>
    toast({
      title: "Url of your code copied to clipboard",
      description: "You can share it wherever you want",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    })

  const ALGOLIA_INDEX_NAME = "forms"

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(ALGOLIA_INDEX_NAME)

  // console.log(dataForm.responses)

  const { updateFormDocument, isLoading: isLoadingUpdateForm }: any =
    useUpdateFormDocument("forms")

  const handleDeleteResponse = async (idResponse: string) => {
    let updatedFormData: {
      responses: any[]
    } = {
      responses: [
        ...dataForm.responses.filter(
          (response: any) => response.idResponse !== idResponse
        ),
      ],
    }

    const id = params["form"]

    //console.log(updatedFormData.responses,)

    await updateFormDocument({ id, updatedFormData })

    await index.partialUpdateObject({
      objectID: id,
      responses: updatedFormData.responses,
    })

    //console.log("updatedFormData", updatedFormData)
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
        pdf.text(`Email Payment : ${response.emailPayment}`, 15, yPos)
        yPos += 8

        pdf.text(`Payment Status : ${response.paymentStatut}`, 15, yPos)
        yPos += 8

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
          if (res.type === "heading") {
            pdf.text(`${res.label}`, 15, yPos)
          } else {
            pdf.text(`${res.label}: ${res.text}`, 15, yPos)
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
            .map((response, index) => (
              <div
                className={cn(
                  "flex w-full flex-col items-start gap-4 rounded-md border border-dashed border-slate-300 p-4 dark:border-slate-700",
                  response.paymentStatut === "complete"
                    ? "border-2 border-solid border-emerald-500 dark:border-emerald-900"
                    : ""
                )}
                key={response.idResponse}
              >
                <Accordion
                  type="single"
                  collapsible
                  className="w-full border-b  border-dashed border-slate-300 dark:border-slate-700"
                >
                  <AccordionItem value="response" className="border-none">
                    <AccordionTrigger>
                      <div className="flex items-center justify-start gap-2">
                        View response
                        {response.paymentStatut === "complete" ? (
                          <span className="mr-2 flex items-center gap-2 rounded bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            PAID
                          </span>
                        ) : null}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {response.paymentStatut === "complete" ? (
                        <div className="text-md mb-4 flex items-center gap-2 rounded bg-green-100 px-2.5 py-1.5 font-medium text-green-800 dark:bg-emerald-900 dark:text-green-300">
                          <p>
                            This user paid with this address :{" "}
                            <a
                              href={`mailto:${response.emailPayment}`}
                              className="underline underline-offset-4"
                            >
                              {response.emailPayment}
                            </a>{" "}
                            , you can check it in your{" "}
                            <a
                              href="https://business.notchpay.co/transactions"
                              className="underline underline-offset-4"
                            >
                              NotchPay Dashboard
                            </a>{" "}
                          </p>
                        </div>
                      ) : null}
                      <div className="flex w-full flex-col items-start gap-2 ">
                        {response.responses.map((answer, answerIndex) => (
                          <>
                            {answer.type === "heading" ? (
                              <h3
                                className="text-xl font-semibold"
                                key={answerIndex}
                              >
                                {answer.label}
                              </h3>
                            ) : (
                              <div
                                className="flex w-full flex-col items-start gap-2 rounded-md bg-slate-100 p-4 dark:bg-slate-800"
                                key={answerIndex}
                              >
                                <Label>{answer.label}</Label>

                                <div className="flex w-full items-center justify-between">
                                  <p className="font-semibold">{answer.text}</p>
                                  <span
                                    className="block cursor-pointer underline underline-offset-2"
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
                                </div>
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-400">
                    <Timer className="mr-1.5 h-4 w-4" />
                    <span className="text-sm font-medium">
                      {formatDateTime(moment(response.createdAt))}
                    </span>
                  </span>
                  <Button
                    variant="destructive"
                    className="text-semibold flex items-center justify-center gap-2 rounded-md px-4 text-white"
                    disabled={isLoadingUpdateForm}
                    onClick={() => {
                      isLoadingUpdateForm
                        ? undefined
                        : handleDeleteResponse(response.idResponse)
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
