import { useState, useEffect } from 'react';
import { Loader, Play } from 'lucide-react';
import axios from 'axios';
import goatMoviesData from '../assets/goat_movies.json';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import { Link } from 'react-router-dom';

const GoatMovies = () => {
	const [categoryThumbnails, setCategoryThumbnails] = useState({});
	const [loading, setLoading] = useState(true);

	// Pre-defined thumbnail movies for each category (first movie of each category)
	const thumbnailMovies = [
		{ title: "The Dark Knight", year: 2008, category: "Action" },
		{ title: "The Godfather", year: 1972, category: "Crime & Thriller" },
		{ title: "The Shawshank Redemption", year: 1994, category: "Drama" },
		{ title: "Spirited Away", year: 2001, category: "Animation" },
		{ title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, category: "Fantasy" },
		{ title: "Interstellar", year: 2014, category: "Sci-Fi" },
		{ title: "Titanic", year: 1997, category: "Romance" },
		{ title: "Superbad", year: 2007, category: "Comedy" },
		{ title: "The Exorcist", year: 1973, category: "Horror" },
		{ title: "Raiders of the Lost Ark", year: 1950, category: "Adventure" },
		{ title: "Singin' in the Rain", year: 1952, category: "Musicals" },
		{ title: "Rocky", year: 1976, category: "Sports" },
		{ title: "Saving Private Ryan", year: 1998, category: "War" },
		{ title: "Seven Samurai", year: 1954, category: "International" },
		// Add more categories as needed based on your goatMoviesData structure
	];

	// Scroll to top when component mounts
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// Fetch thumbnails for all categories in one request
	useEffect(() => {
		const fetchCategoryThumbnails = async () => {
			// Check sessionStorage first
			const cached = sessionStorage.getItem('goat_movies_category_thumbnails');
			if (cached) {
				try {
					setCategoryThumbnails(JSON.parse(cached));
					setLoading(false);
					return;
				} catch (e) {
					console.error('Error parsing cached thumbnails:', e);
				}
			}

			// Fetch all thumbnails in one batch request
			try {
				setLoading(true);
				const res = await axios.post('/api/v1/movies/goat-movies', {
					movies: thumbnailMovies
				});
				
				if (res.data.success && res.data.content) {
					// Map movies to their categories
					const thumbnails = {};
					res.data.content.forEach((movie, index) => {
						const category = thumbnailMovies[index].category;
						thumbnails[category] = movie;
					});
					
					setCategoryThumbnails(thumbnails);
					sessionStorage.setItem('goat_movies_category_thumbnails', JSON.stringify(thumbnails));
				}
			} catch (error) {
				console.error('Error fetching thumbnails:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategoryThumbnails();
	}, []);

	return (
		<div className="min-h-screen bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold mb-2">Genres</h1>
					<p className="text-gray-400">The Greatest Movies in different genres</p>
				</div>

				{/* Loading State */}
				{loading && (
					<div className="flex justify-center items-center h-64">
						<Loader className="animate-spin text-white" size={48} />
					</div>
				)}

				{/* Categories Grid */}
				{!loading && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{Object.keys(goatMoviesData).map((category) => {
							const thumbnail = categoryThumbnails[category];
							
							return (
								<Link
									key={category}
									to={`/genres/${category.toLowerCase().replace(/\s+/g, '-')}`}
									className="relative group cursor-pointer rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
								>
									{/* Thumbnail Image */}
									<div className="aspect-video bg-gray-800">
										{thumbnail ? (
											<img
												src={ORIGINAL_IMG_BASE_URL + thumbnail.backdrop_path}
												alt={category}
												className="w-full h-full object-cover group-hover:opacity-75 transition"
												onError={(e) => {
													e.target.src = 'https://via.placeholder.com/400x225?text=No+Image';
												}}
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center">
												<Loader className="animate-spin" size={40} />
											</div>
										)}
									</div>
									
									{/* Category Label */}
									<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-6">
										<div>
											<h2 className="text-2xl font-bold mb-1">{category}</h2>
											<p className="text-gray-300 text-sm">
												{goatMoviesData[category].length} movies
											</p>
										</div>
									</div>

									{/* Play Icon Overlay */}
									<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
										<div className="bg-red-600 rounded-full p-4">
											<Play size={32} fill="white" />
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default GoatMovies;