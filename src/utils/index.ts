import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const fetchRandomSubset = <T>(arr: T[], num: number): T[] => {
  if (num > arr.length)
    throw new Error("Requested more items than available in the array.");

  let shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, num);
};

export const requestApi = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  params: Record<string, any> = {}
): Promise<T | null> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      ...(method === "GET" ? { params } : { data: params }),
    };

    const response: AxiosResponse<T> = await axios.request<T>(config);
    return response.data;
  } catch (error: any) {
    console.error(`${method}: ${url}`, error.response?.data || error.message);
    return null;
  }
};
