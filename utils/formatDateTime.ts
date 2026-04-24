import moment from "moment"
import "moment/locale/fr"

function formatDateTime(date: string | number | Date): string {
  moment.locale("en")
  const now = moment()
  const targetDateUtc = moment.utc(date, "YYYY-MM-DD HH:mm:ss")
  const targetDateLocal = targetDateUtc.local()

  if (now.diff(targetDateLocal, "days") >= 7) {
    return targetDateLocal.format("DD MMM YYYY")
  }
  return targetDateLocal.fromNow()
}

export default formatDateTime
