import moment from 'moment';
import 'moment/locale/fr';

function formatDateTime(date) {
  moment.locale('en');
  const now = moment();
  const targetDateUtc = moment.utc(date, 'YYYY-MM-DD HH:mm:ss');
  const targetDateLocal = targetDateUtc.local();

  // conast targetDateLocal = moment(date);

  if (now.diff(targetDateLocal, 'days') >= 7) {
    return targetDateLocal.format('DD MMM YYYY');
  } else {
    return targetDateLocal.fromNow();
  }
}

export default formatDateTime;
