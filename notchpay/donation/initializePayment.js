import { useState } from "react"
import axios from "axios"

const INITIALIZE_URL = "https://api.notchpay.co/payments/initialize"

export default function usePaymentInitialization() {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const initializePayment = async (email, amount, description) => {
    setIsLoading(true)
    setIsError(false)

    const data = {
      email,
      currency: "EUR",
      amount,
      description,
      // callback: "http://localhost:3000/donation",
      callback: "https://sharuco.lndev.me/donation",
    }

    try {
      const response = await axios.post(INITIALIZE_URL, data, {
        headers: {
          Accept: "application/json",
          Authorization: process.env.NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY,
        },
      })

      const authorizationUrl = response.data.authorization_url
      // console.log(response.data)
      // stock la reference dans le local storage
      localStorage.setItem(
        "transaction-donation-reference",
        response.data.transaction.reference
      )
      window.open(authorizationUrl, "_blank")
    } catch (error) {
      setIsError(true)
      // console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { initializePayment, isLoading, isError }
}
