import axios from 'axios';

const createApi = (baseURL: string) => {
  const api = axios.create({
    baseURL
  });

  return api;
};

export function useApi() {
  const f1DbApi = createApi(import.meta.env.VITE_OPEN_F1_URL);

  return { f1DbApi };
}
