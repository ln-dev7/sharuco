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
      currency: "EUR",
      amount,
      description,
      callback: "http://localhost:3000/join-sharucoplus",
      // callback: "https://sharuco.lndev.me/join-sharucoplus",
    }

    try {
      const response = await axios.post(INITIALIZE_URL, data, {
        headers: {
          Accept: "application/json",
          Authorization: NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY,
        },
      })

      const authorizationUrl = response.data.authorization_url
      // console.log(response.data)
      // stock la reference dans le local storage
      localStorage.setItem(
        "transaction-reference",
        response.data.transaction.reference
      )
      localStorage.setItem("customer-id", response.data.transaction.customer.id)
      window.open(authorizationUrl, "_blank")
      // https://sharuco.lndev.me/join-sharucoplus?reference=bTPFKcLzeicWRYBCfV1ewePbrLBamZ5N&trxref=bTPFKcLzeicWRYBCfV1ewePbrLBamZ5N&status=complete&hash=50151a846e1288f9cd53ee7c7c58763d&np-callback=callback&notchpay_txnref=
    } catch (error) {
      setIsError(true)
      // console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { initializePayment, isLoading, isError }
}
