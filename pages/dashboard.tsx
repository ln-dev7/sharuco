"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import Highlight, { defaultProps } from "prism-react-renderer"
import { render } from "react-dom"

import { Button } from "@/components/ui/button"
import addData from "../firebase/firestore/addData"
import getDocuments from "../firebase/firestore/getDocuments"

function Dashboard() {
  const { user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (user == null) router.push("/")
  }, [user])

  const handleAddCode = async () => {
    const data = {
      idAuthor: "ln-de7",
      language: "JavaScript",
    }
    const { result, error } = await addData("codes", "user-id", data)

    if (error) {
      return console.log(error)
    }
  }

  const [allCodes, setAllCodes]: [any, (value: any) => void] = useState([])

  useEffect(() => {
    const fetchAllCodes = async () => {
      const { result, error } = await getDocuments("codes")
      if (error) {
        return console.log(error)
      }
      setAllCodes(result.docs.map((doc) => doc.data()))
    }
    fetchAllCodes()
  }, [])

  return (
    <div className="mb-16 p-16">
      <div>
        <h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
          Dashboard
        </h2>
        <div className="flex flex-col gap-4 p-8">
          {allCodes.map((code) => (
            <div key={code.id}>
              <p>{code.language}</p>
              <p>{code.idAuthor}</p>
              <Highlight {...defaultProps} code={code.code} language="javascript">
                {({
                  className,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps,
                }) => (
                  <pre className={className} style={style}>
                    {tokens.map((line, i) => (
                      <div {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => (
                          <span {...getTokenProps({ token, key })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          ))}
          <Button className="w-max" onClick={handleAddCode}>
            Add code
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
