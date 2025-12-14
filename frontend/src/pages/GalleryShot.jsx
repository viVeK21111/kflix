import { useState, useEffect } from 'react';
import { Trash2, Upload, ExternalLink, Loader, X,ArrowBigRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { userAuthStore } from '../store/authUser';
import { Link } from 'react-router-dom';
import axios from 'axios';


const GalleryShot = () => {
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showUploadDialog, setShowUploadDialog] = useState(false);
	const [imageUrl, setImageUrl] = useState('');
	const [uploading, setUploading] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const { user } = userAuthStore();

	// Fetch all images
	useEffect(() => {
		fetchImages();
	}, []);

	const fetchImages = async () => {
		try {
			setLoading(true);
			const res = await axios.get('/api/gallery/all');
			const data = res.data;
			if (data.success) {
				setImages(data.images);
			}
		} catch (error) {
			console.error('Error fetching images:', error);
			toast.error('Failed to load images');
		} finally {
			setLoading(false);
		}
	};

	// Validate image URL format
	const isValidImageUrl = (url) => {
		const imageExtensions = [
			'.jpg', '.jpeg', '.png', '.gif', '.webp', 
			'.svg', '.bmp', '.ico', '.tiff', '.tif'
		];
		
		const lowercaseUrl = url.toLowerCase();
		return imageExtensions.some(ext => lowercaseUrl.includes(ext));
	};

	const handleUpload = async (e) => {
		e.preventDefault();
		
		if (!imageUrl.trim()) {
			toast.error('Please enter an image URL');
			return;
		}

		// Validate image format
		if (!isValidImageUrl(imageUrl)) {
			toast.error('Invalid image link! URL must contain a valid image format (.jpg, .png, .gif, .webp, .svg, etc.)');
			return;
		}

		try {
			setUploading(true);
			const res = await axios.post('/api/gallery/upload', { imageUrl });
			const data = res.data;
			
			if (data.success) {
				toast.success('Image uploaded successfully!');
				setImageUrl('');
				setShowUploadDialog(false);
				fetchImages(); // Refresh the gallery
			} else {
				toast.error(data.message || 'Failed to upload image');
			}
		} catch (error) {
			console.error('Error uploading image:', error);
			toast.error('Failed to upload image');
		} finally {
			setUploading(false);
		}
	};

	const handleDelete = async (imageId) => {
		if (!confirm('Are you sure you want to delete this image?')) return;

		try {
			const res = await axios.delete(`/api/gallery/${imageId}`);
			const data = res.data;
			
			if (data.success) {
				toast.success('Image deleted successfully!');
				fetchImages(); // Refresh the gallery
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
		<div className="min-h-screen bg-gray-900 text-white ">
			<div className="max-w-full ">
				{/* Header with Upload Button */}
				<div className="md:flex justify-between items-center mb-6 bg-gray-800 p-6 ">
                    <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Flixery</h1>
                    <p className='my-4 md:mt-2'>Upload your best cinematic photos shot on your mobile phone or camera</p>
                    </div>
					
					<button
						onClick={() => setShowUploadDialog(true)}
						className="flex my-2 md:my-0 items-center gap-2 bg-red-600 hover:bg-red-700 px-3 md:px-6 py-2 md:py-3 rounded-lg transition shadow-lg"
					>
						<Upload size={18} />
						<span className="font-semibold">Upload Image</span>
					</button>
				</div>
                <div className='flex text-blue-400 px-2'><Link className='ml-auto flex items-center pb-2 px-1 hover:underline' to={'/user/gallery-img'}>Go to My pics</Link><ArrowBigRight className='items-center flex mt-1' size={18}/></div>

				{/* Upload Dialog Box */}
				{showUploadDialog && (
					<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
						<div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full shadow-2xl border border-gray-700">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold">Upload Image</h2>
								<button
									onClick={() => {
										setShowUploadDialog(false);
										setImageUrl('');
									}}
									className="text-gray-400 hover:text-white text-2xl"
								>
									×
								</button>
							</div>
							
							<form onSubmit={handleUpload}>
								{/* Image URL Input with Reference Link Side by Side */}
								<div className="mb-6 ">
									<label className="block text-sm font-medium mb-3">
										Paste Direct Image Link
									</label>
									<div className="md:flex gap-3 items-start">
										<input
											type="url"
											value={imageUrl}
											onChange={(e) => setImageUrl(e.target.value)}
											placeholder="https://i.postimg.cc/..."
											className="flex-1 w-full my-2 md:my-0 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
											required
										/>
										<a
											href="https://postimages.org/"
											target="_blank"
											rel="noopener noreferrer"
											className="flex w-36 items-center gap-2 text-sm md:text-base bg-green-600 hover:bg-green-700 px-2 md:px-4 py-2 md:py-3 rounded-lg transition whitespace-nowrap"
											title="Upload to PostImages"
										>
											<ExternalLink size={18} />
											<span className="font-medium">PostImages</span>
										</a>
									</div>
									<p className="text-xs text-gray-400 mt-2">
										Upload to PostImages, then copy the "Direct Link" (must end with .jpg, .png, .gif, etc.)
									</p>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-3">
									<button
										type="submit"
										disabled={uploading}
										className="flex-1 bg-blue-600 text-sm md:text-base hover:bg-blue-700 px-2 md:px-6 py-2 md:py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
									>
										{uploading ? (
											<span className="flex items-center justify-center gap-2">
												<Loader className="animate-spin" size={18} />
												Uploading...
											</span>
										) : (
											'Add to Gallery'
										)}
									</button>
									<button
										type="button"
										onClick={() => {
											setShowUploadDialog(false);
											setImageUrl('');
										}}
										className="flex-1 text-sm md:text-base bg-gray-700 hover:bg-gray-600 px-2 md:px-6 py-2 md:py-3 rounded-lg transition font-semibold"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

                {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
                    onClick={() => setSelectedImage(null)}
                >
                    {/* Close button */}
                    <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 bg-gray-800 bg-opacity-70 rounded-full p-2 transition z-10"
                    title="Close"
                    >
                    <X size={24} />
                    </button>

                    {/* Full viewport container */}
                    <div
                    className="relative w-screen h-screen flex items-center justify-center"
                    onClick={e => e.stopPropagation()} // don't close when clicking image area
                    >
                    <img
                        src={selectedImage.imageUrl}
                        alt="Full size"
                        className="w-screen h-screen object-contain rounded-md shadow-2xl"
                        style={{ maxWidth: '90vw', maxHeight: '90vh' }} // hard cap at viewport
                    />
                    </div>

                    {/* Caption */}
                    <div className="absolute sm:bottom-4 bottom-14 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg">
                    <p className="font-semibold text-md sm:text-lg">{selectedImage.uploaderUsername}</p>
                    <p className="text-xs sm:text-sm text-gray-300">{formatDate(selectedImage.uploadedAt)}</p>
                    </div>
                </div>
                )}


				{/* Loading State */}
				{loading && (
					<div className="flex justify-center items-center py-20">
						<Loader className="animate-spin" size={40} />
					</div>
				)}

				{/* Empty State */}
				{!loading && images.length === 0 && (
					<div className="text-center py-20 bg-gray-800 rounded-xl">
						<p className="text-2xl text-gray-300 mb-4">No images yet. Be the first to upload!</p>
					</div>
				)}

				{/* Images Grid */}
				{!loading && images.length > 0 && (
					<div className="grid p-2 md:p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{images.map((image) => (
							<div
								key={image._id}
								className="bg-gray-800 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl  transition-all duration-300 border border-gray-700"
							>
								<div 
									className="aspect-video overflow-hidden cursor-pointer"
									onClick={() => setSelectedImage(image)}
								>
									<img
										src={image.imageUrl}
										alt="Gallery"
										className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
										onError={(e) => {
											e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
										}}
									/>
								</div>
								<div className="p-3">
									<div className="flex justify-between items-start">
										<div>
											<p className="font-semibold">{image.uploaderUsername}</p>
											<p className="text-sm text-gray-400">{formatDate(image.uploadedAt)}</p>
										</div>
										{user?.email === image.uploaderEmail && (
											<button
												onClick={() => handleDelete(image._id)}
												className="text-red-500 hover:text-red-400 transition"
												title="Delete image"
											>
												<Trash2 size={20} />
											</button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default GalleryShot;