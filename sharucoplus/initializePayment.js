import { useState } from "react"
import axios from "axios"

const NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY

const NEXT_PUBLIC_NOTCH_PAY_API_URL = process.env.NEXT_PUBLIC_NOTCH_PAY_API_URL

const INITIALIZE_URL = `${NEXT_PUBLIC_NOTCH_PAY_API_URL}/initialize`

export default function usePaymentInitialization() {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const initializePayment = async (email, amount, description) => {
    setIsLoading(true)
    setIsError(false)

    const data = {
      email,
      currency: "XAF",
      amount,
      description,
      callback: "https://sharuco.lndev.me/join-sharucoplus",
    }

    try {
      const response = await axios.post(INITIALIZE_URL, data, {
        headers: {
          Accept: "application/json",
          Authorization: NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY,
        },
      })

      const authorizationUrl = response.data.authorization_url
      window.open(authorizationUrl, "_blank")
    } catch (error) {
      setIsError(true)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { initializePayment, isLoading, isError }
}
