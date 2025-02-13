import { useContentStore } from "../store/content";
import axios from "axios";

import React, { useEffect, useState } from 'react'

const useGetTrendingContent = () => {
  const [trending,setTrending] = useState(null);
  const {contentType} = useContentStore();
  useEffect ( ()=> {
    const getTrendingContent = async() => {
        const res = await axios.get(`/api/v1/${contentType}/trending`);
        setTrending(res.data.content);
    }
    getTrendingContent();
  },[contentType]);
  return {trending};
}

export default useGetTrendingContent;