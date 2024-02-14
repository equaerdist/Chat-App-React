import { useCallback, useState } from "react";

const useHttp = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const useGet = useCallback(
    (
      url,
      headers = {
        "Content-type": "application/json",
      }
    ) => {
      use;
    },
    []
  );
};
