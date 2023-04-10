import axios from "axios"
import { useQuery } from "react-query"

const initializeUrl = process.env.NOTCH_PAY_API_URL + "/initialize"

export const initializePayment = async (data) => {
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: process.env.NOTCH_PAY_PUBLIC_KEY,
    },
  }
  const response = await axios.post(initializeUrl, data, config)
  return response.data
}

export const usePayment = (data) => {
  return useQuery("payment", () => initializePayment(data))
}
