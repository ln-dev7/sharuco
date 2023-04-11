import axios from "axios"
import { useQuery } from "react-query"

const initializeUrl = `https://api.notchpay.co/payments/initialize`

export const initializePayment = async (data) => {
  const config = {
    headers: {
      Accept: "application/json",
        Authorization: "b.Aqeus5ZknbURn32X",
    },
  }
  const response = await axios.post(initializeUrl, data, config)
  return response.data
}

export const usePayment = (data) => {
  return useQuery("payment", () => initializePayment(data))
}
