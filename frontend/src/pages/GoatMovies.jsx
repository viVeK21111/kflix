import { useState, useEffect } from 'react';
import { Loader, Play } from 'lucide-react';
import axios from 'axios';
import goatMoviesData from '../assets/goat_movies.json';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import { Link } from 'react-router-dom';

const GoatMovies = () => {
	const [categoryThumbnails, setCategoryThumbnails] = useState({});

	// Scroll to top when component mounts
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// Fetch first movie thumbnail for each category
	useEffect(() => {
		const fetchCategoryThumbnails = async () => {
			// Check sessionStorage first
			const cached = sessionStorage.getItem('goat_movies_category_thumbnails');
			if (cached) {
				try {
					setCategoryThumbnails(JSON.parse(cached));
					return;
				} catch (e) {
					console.error('Error parsing cached thumbnails:', e);
				}
			}

			// Fetch if not cached
			const thumbnails = {};
			
			for (const [category, movieList] of Object.entries(goatMoviesData)) {
				if (movieList && movieList.length > 0) {
					const firstMovie = movieList[0];
					try {
						const res = await axios.post('/api/v1/movies/goat-movies', {
							movies: [firstMovie]
						});
						
						if (res.data.success && res.data.content.length > 0) {
							thumbnails[category] = res.data.content[0];
						}
					} catch (error) {
						console.error(`Error fetching thumbnail for ${category}:`, error);
					}
				}
			}
			
			setCategoryThumbnails(thumbnails);
			sessionStorage.setItem('goat_movies_category_thumbnails', JSON.stringify(thumbnails));
		};

		fetchCategoryThumbnails();
	}, []);

	return (
		<div className="min-h-screen bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold mb-2">GMOAT</h1>
					<p className="text-gray-400">The Greatest Movies of All Time</p>
				</div>

				{/* Categories Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Object.keys(goatMoviesData).map((category) => {
						const thumbnail = categoryThumbnails[category];
						
						return (
							<Link
								key={category}
								to={`/goat-movies/${category.toLowerCase().replace(/\s+/g, '-')}`}
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
			</div>
		</div>
	);
};

export default GoatMovies;