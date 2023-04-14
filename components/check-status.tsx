import React, { useEffect } from "react"
import { SUBSCRIPTIONS_TYPE } from "@/constants/subscriptions-infos.js"
import { useAuthContext } from "@/context/AuthContext.js"
import { useDocument } from "@/firebase/firestore/getDocument.js"
import { useUpdateUserDocument } from "@/firebase/firestore/updateUserDocument.js"
import moment from "moment"

export default function CheckStaus() {
  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(pseudo, "users")

  const { updateUserDocument }: any = useUpdateUserDocument("users")
  // --- CHeck if user is premium
  useEffect(() => {
    const currentDate = moment()
    const premiumStartDay = moment(dataUser?.data.premiumStartDay)
    if (
      user &&
      dataUser?.data.premium &&
      dataUser?.data.premiumType === SUBSCRIPTIONS_TYPE.MONTHLY
    ) {
      const monthDiff = currentDate.diff(premiumStartDay, "months")
      if (monthDiff >= 1) {
        updateUserDocument({
          pseudo,
          updatedUserData: {
            premium: false,
            premiumType: null,
            premiumPrice: null,
            premiumStartDay: null,
          },
        })
      }
    }
    if (
      user &&
      dataUser?.data.premium &&
      dataUser?.data.premiumType === SUBSCRIPTIONS_TYPE.YEARLY
    ) {
      const yearDiff = currentDate.diff(premiumStartDay, "years")
      if (yearDiff >= 1) {
        updateUserDocument({
          pseudo,
          updatedUserData: {
            premium: false,
            premiumType: null,
            premiumPrice: null,
            premiumStartDay: null,
          },
        })
      }
    }
  }, [dataUser])
  return <></>
}
