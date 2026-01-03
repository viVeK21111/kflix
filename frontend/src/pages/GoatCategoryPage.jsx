import { useState, useEffect } from 'react';
import { Loader, ArrowLeft, Play } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import goatMoviesData from '../assets/goat_movies.json';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';

const GoatCategoryPage = () => {
	const { category } = useParams();
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [categoryName, setCategoryName] = useState('');

	// Scroll to top when component mounts
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const fetchCategoryMovies = async () => {
			// Convert URL param back to category name (e.g., "sci-fi" -> "Sci-Fi")
			const foundCategory = Object.keys(goatMoviesData).find(
				cat => cat.toLowerCase().replace(/\s+/g, '-') === category
			);

			if (!foundCategory) {
				toast.error('Category not found');
				setLoading(false);
				return;
			}

			setCategoryName(foundCategory);

			// Check sessionStorage first
			const cacheKey = `goat_movies_${category}`;
			const cached = sessionStorage.getItem(cacheKey);
			
			if (cached) {
				try {
					setMovies(JSON.parse(cached));
					setLoading(false);
					return;
				} catch (e) {
					console.error('Error parsing cached movies:', e);
				}
			}

			// Fetch from API
			setLoading(true);
			try {
				const categoryMovies = goatMoviesData[foundCategory];
				
				const res = await axios.post('/api/v1/movies/goat-movies', {
					movies: categoryMovies
				});

				if (res.data.success) {
					setMovies(res.data.content);
					sessionStorage.setItem(cacheKey, JSON.stringify(res.data.content));
				} else {
					toast.error('Failed to load movies');
				}
			} catch (error) {
				console.error('Error fetching movies:', error);
				toast.error('Failed to load movies');
			} finally {
				setLoading(false);
			}
		};

		fetchCategoryMovies();
	}, [category]);

	return (
		<div className="min-h-screen bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-4">
						<Link
							to="/genres"
							className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
						>
							<ArrowLeft size={20} />
							Back
						</Link>
						<h1 className="text-4xl font-bold">{categoryName} Movies</h1>
					</div>
				</div>

				{/* Loading State */}
				{loading && (
					<div className="mb-8">
						<div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
							<div className="bg-red-600 h-full animate-pulse" style={{ width: '100%' }}></div>
						</div>
						<div className="flex justify-center items-center mt-4">
							<Loader className="animate-spin mr-2" size={24} />
							<span className="text-gray-400">Loading movies...</span>
						</div>
					</div>
				)}

				{/* Movies Grid */}
				{!loading && movies.length > 0 && (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						{movies.map((movie) => (
							<Link
								key={movie.id}
								to={`/movie/?id=${movie.id}&name=${movie.title}`}
								className="group relative"
							>
								<div className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
									<img
										src={ORIGINAL_IMG_BASE_URL + movie.poster_path}
										alt={movie.title}
										className="w-full h-full object-cover"
										onError={(e) => {
											e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
										}}
									/>
									
									{/* Hover Overlay */}
									<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
										<div className="text-center px-4">
											<Play size={40} className="mx-auto mb-2" />
											<p className="font-semibold text-sm">{movie.title}</p>
											<p className="text-xs text-gray-300">
												{movie.release_date?.split('-')[0]}
											</p>
										</div>
									</div>
								</div>
								
								{/* Movie Title Below */}
								<div className="mt-2">
									<p className="font-semibold text-sm truncate">{movie.title}</p>
									<div className="flex items-center gap-2 text-xs text-gray-400">
										<span>{movie.release_date?.split('-')[0]}</span>
										<span>⭐ {movie.vote_average?.toFixed(1)}</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}

				{/* Empty State */}
				{!loading && movies.length === 0 && (
					<div className="text-center py-20">
						<p className="text-xl text-gray-400">No movies found in this category</p>
						<Link
							to="/genres"
							className="mt-4 inline-block bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
						>
							Back to Categories
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default GoatCategoryPage;