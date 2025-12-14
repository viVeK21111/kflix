import React, { useEffect, useState } from 'react'
import { useContentStore } from "../store/content";
import axios from "axios";

const useGetTrendingContent = () => {
  const [trending, setTrending] = useState(null);
  const [loading, setLoading] = useState(true);
  const { contentType } = useContentStore();

  useEffect(() => {
    const getTrendingContent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/${contentType}/trending`);
        setTrending(res.data.content);
      } catch (error) {
        console.error("Failed to fetch trending content:", error);
      } finally {
        setLoading(false);
      }
    };
    getTrendingContent();
  }, [contentType]);

  return { trending, loading };
};

export default useGetTrendingContent;
