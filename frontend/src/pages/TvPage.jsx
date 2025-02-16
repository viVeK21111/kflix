import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { tvDetailsStore } from '../store/tvdetails';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';

const TvPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const { getdetails, data } = tvDetailsStore();

  useEffect(() => {
    if (id) {
      getdetails(id);
    }
  }, [id, getdetails]);
 
  return (
    data && (
      <div className="text-white bg-gradient-to-b from-gray-900 to-black min-h-screen p-6">
        {/* Header Section */}
        <header className="relative mb-10">
          <img
            className="w-full h-full object-cover rounded-xl shadow-2xl"
            src={`${ORIGINAL_IMG_BASE_URL}${data.backdrop_path}`}
            alt="TV Show"
          />
          <div className="absolute bottom-6 left-6 bg-black bg-opacity-70 p-6 rounded-lg">
            <h1 className="text-5xl font-bold mb-4 text-yellow-400">{data?.name}</h1>
            <p className="text-lg mb-3 max-w-2xl">{data?.overview}</p>
            <div className="text-md">
              <p><strong>Creator:</strong> {data?.created_by[0]?.name || "Unknown"}</p>
              <p><strong>View:</strong> {data?.adult ? "18+" : "PG-13"}</p>
              <p><strong>Rating:</strong> {data?.vote_average}</p>
              <p><strong>Total Seasons:</strong> {data?.number_of_seasons}</p>
              <p><strong>Total Episodes:</strong> {data?.number_of_episodes}</p>
              <p><strong>First Air Date:</strong> {data?.first_air_date}</p>
              <p><strong>Last Air Date:</strong> {data?.last_air_date}</p>
            </div>
          </div>
        </header>

        {/* Seasons Section */}
        <div className="mt-6">
          <h2 className="text-4xl font-semibold mb-6 text-white-400 border-b-4 border-yellow-400 pb-2">Seasons</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {data?.seasons?.map((season) => (
              <div key={season.id} className="bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105">
                <img
                  src={season.poster_path ? `${ORIGINAL_IMG_BASE_URL}${season.poster_path}` : `${ORIGINAL_IMG_BASE_URL}${data.poster_path}`}
                  alt={season.name}
                  className="w-48 h-60 object-cover mb-3 rounded-lg mx-auto"
                />
                <h3 className="text-xl font-bold mb-2 text-center text-white-300">{season.name}</h3>
                <p className="mb-3 text-center">Episodes: {season.episode_count}</p>

                {/* Episodes List */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {Array.from({ length: season.episode_count }, (_, i) => i + 1).map((episode) => (
                    <Link
                      to={`/watch/?id=${data?.id}&name=${data?.name}&season=${season.season_number}&episode=${episode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-red-800 hover:bg-red-900 rounded-md text-white text-sm"
                    >
                      Ep {episode}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default TvPage;
