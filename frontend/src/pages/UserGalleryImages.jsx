import { useState, useEffect } from 'react';
import { Trash2, Loader, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios'

const UserGalleryImages = () => {
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchMyImages();
	}, []);

	const fetchMyImages = async () => {
		try {
			setLoading(true);
			const res = await axios.get('/api/gallery/my-images');
			const data = res.data;
			if (data.success) {
				setImages(data.images);
			}
		} catch (error) {
			console.error('Error fetching images:', error);
			toast.error('Failed to load your images');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (imageId) => {
		if (!confirm('Are you sure you want to delete this image?')) return;

		try {
			const res = await axios.delete(`/api/gallery/${imageId}`);
    		const data = res.data;
			
			if (data.success) {
				toast.success('Image deleted successfully!');
				fetchMyImages(); // Refresh the gallery
			} else {
				toast.error(data.message || 'Failed to delete image');
			}
		} catch (error) {
			console.error('Error deleting image:', error);
			toast.error('Failed to delete image');
		}
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<Link 
						to="/gallery-shot" 
						className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
					>
						<ArrowLeft size={20} />
						Back to Public Gallery
					</Link>
					<h1 className="text-3xl font-bold">My Gallery Images</h1>
					<p className="text-gray-400 mt-2">Manage your uploaded images</p>
				</div>

				{/* Loading State */}
				{loading && (
					<div className="flex justify-center items-center py-20">
						<Loader className="animate-spin" size={40} />
					</div>
				)}

				{/* Empty State */}
				{!loading && images.length === 0 && (
					<div className="text-center py-20">
						<p className="text-xl text-gray-400 mb-4">You haven't uploaded any images yet</p>
						<Link 
							to="/gallery-shot"
							className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
						>
							Go to Gallery to Upload
						</Link>
					</div>
				)}

				{/* Images Grid */}
				{!loading && images.length > 0 && (
					<>
						<div className="mb-4 text-gray-400">
							Total Images: {images.length}
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{images.map((image) => (
								<div
									key={image._id}
									className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition"
								>
									<div className="aspect-video overflow-hidden">
										<img
											src={image.imageUrl}
											alt="Gallery"
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
											onError={(e) => {
												e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
											}}
										/>
									</div>
									<div className="p-4">
										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm text-gray-400">
													Uploaded: {formatDate(image.uploadedAt)}
												</p>
											</div>
											<button
												onClick={() => handleDelete(image._id)}
												className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition"
												title="Delete image"
											>
												<Trash2 size={18} />
											</button>
										</div>
										<div className="mt-3">
											<a
												href={image.imageUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="text-xs text-blue-400 hover:text-blue-300 break-all"
											>
												View full image
											</a>
										</div>
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default UserGalleryImages;