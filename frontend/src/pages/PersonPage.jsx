import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PersonStore } from "../store/PersonStore"; // Assuming store import
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants"; // Import Image base URL

export default function PersonPage() {
  const { data, getPersonDetails } = PersonStore();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    if (id) {
      getPersonDetails(id).finally(() => setLoading(false));
      window.scrollTo(0,0);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6">
        {/* Profile Image */}
        <img
          src={`${ORIGINAL_IMG_BASE_URL}${data.profile_path}`}
          alt={data?.name}
          className="w-48 h-48 rounded-lg object-cover border-4 border-white-500 shadow-lg"
        />

        {/* Details Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-yellow-400">{data.name}</h1>
          {data.also_known_as && (
            <p className="text-gray-300 mt-2 text-sm">
              <b>Also Known As:</b> {data.also_known_as.slice(0, 4).join(", ")}
            </p>
          )}
          <p className="mt-2 text-white-400 text-sm">
            <b>Born</b>: {data.birthday} ({new Date().getFullYear()-data.birthday.split("-")[0]} years) <b className="ml-3">Place:</b> {data.place_of_birth}
          </p>
          {data.deathday && (
            <p>Death: {data.deathday}</p>
          )}
          {data.known_for_department && (
            <p className="mt-2"><b>Department:</b> {data.known_for_department}</p>
          )}

          {/* Links */}
          <div className="flex gap-4 mt-4">
            {data.homepage && (
              <a
                href={data.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all"
              >
                Official Website
              </a>
            )}
            {data.imdb_id && (
              <a
                href={`https://www.imdb.com/name/${data.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-700 transition-all"
              >
                IMDB
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Biography Section */}
      <div className="mt-6 max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-yellow-400 mb-2">Biography</h2>
        <p className="text-gray-300 text-sm leading-relaxed">{data.biography || "No biography available."}</p>
      </div>
    </div>
  );
}
