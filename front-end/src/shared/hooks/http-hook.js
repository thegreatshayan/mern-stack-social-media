import { useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    async (route, method = "GET", body = null, headers) => {
      const httpAbortCtrl = new AbortController();

      activeHttpRequest.current.push(httpAbortCtrl);

      try {
        const response = await fetch(`http://localhost:5000/api/${route}`, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
          (item) => item !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        return responseData;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequest.current.forEach((item) => item.abort());
    };
  }, []);

  return { sendRequest };
};
