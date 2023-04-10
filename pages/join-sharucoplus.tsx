import React from "react"
import { usePayment } from "@/sharucoplus/payment/init.js"
import { useForm } from "react-hook-form"

export default function JoinSharucoplus() {
  const { register, handleSubmit } = useForm()
  const { isLoading, isError, data, error, isSuccess } = usePayment()
  usePayment(data)
  const onSubmit = (data) => {}
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" name="email"  />
        <input type="text" name="phone"  />
        <input type="text" name="name"  />
        <input type="text" name="amount"  />
        <input type="text" name="currency"  />
        <input type="text" name="reference"  />
        <input type="text" name="description"  />
        <input type="text" name="callback_url"  />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "En cours..." : "Payer"}
        </button>
      </form>
      {isSuccess && <p>Paiement effectué avec succès. ID de paiemen</p>}
      {isError && <p>Une erreur est survenue </p>}
    </div>
  )
}
