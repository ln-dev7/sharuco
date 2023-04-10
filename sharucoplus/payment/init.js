import axios from 'axios';
import { useQuery } from 'react-query';

const NOTCH_PAY_PUBLIC_KEY = 'VOTRE_CLÉ_PUBLIQUE';
const NOTCH_PAY_API_URL = 'https://api.notchpay.co/payments/initialize';

export const initializePayment = async (data) => {
  const config = {
    headers: {
      Accept: 'application/json',
      Authorization: NOTCH_PAY_PUBLIC_KEY,
    },
  };
  const response = await axios.post(NOTCH_PAY_API_URL, data, config);
  return response.data;
};

export const usePayment = (data) => {
  return useQuery('payment', () => initializePayment(data));
};
