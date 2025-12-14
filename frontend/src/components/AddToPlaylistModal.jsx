// AddToPlaylistModal.jsx
import { useState, useEffect } from 'react';
import { X, Plus, Check, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddToPlaylistModal = ({ isOpen, onClose, item }) => {
	const [playlists, setPlaylists] = useState([]);
	const [loading, setLoading] = useState(true);
	const [addingTo, setAddingTo] = useState(null);

	useEffect(() => {
		if (isOpen) {
			fetchPlaylists();
		}
	}, [isOpen]);

	const fetchPlaylists = async () => {
		try {
			setLoading(true);
			const res = await axios.get('/api/v1/playlist/all');
			if (res.data.success) {
				setPlaylists(res.data.playlists);
			}
		} catch (error) {
			console.error('Error fetching playlists:', error);
			toast.error('Failed to load playlists');
		} finally {
			setLoading(false);
		}
	};

	const handleAddToPlaylist = async (playlistId) => {
		setAddingTo(playlistId);
		
		try {
			const payload = {
				type: item.type,
				id: item.id,
				image: item.image,
				title: item.title,
			};

			// Add TV-specific fields if it's an episode
			if (item.season !== undefined && item.episode !== undefined) {
				payload.season = item.season;
				payload.episode = item.episode;
				payload.name = item.name;
				payload.totalEpisodes = item.totalEpisodes;
			}

			const res = await axios.post(`/api/v1/playlist/${playlistId}/add`, payload);
			
			if (res.data.success) {
				toast.success(res.data.message);
				onClose();
			} else {
				toast.error(res.data.message);
			}
		} catch (error) {
			console.error('Error adding to playlist:', error);
			toast.error('Failed to add to playlist');
		} finally {
			setAddingTo(null);
		}
	};
	const handleClose = () => {
		setPlaylists([]);
		onClose();
	}

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
			<div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
				{/* Header */}
				<div className="flex justify-between items-center p-4 border-b border-gray-700">
					<h2 className="text-xl font-bold text-white">Save to...</h2>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-white transition"
					>
						<X size={24} />
					</button>
				</div>

				{/* Content */}
				<div className="p-4 overflow-y-auto max-h-[60vh]">
					{loading ? (
						<div className="flex justify-center py-8">
							<Loader className="animate-spin text-white" size={32} />
						</div>
					) : (
						<>
							
								<div className="space-y-2">
									{playlists.map((playlist) => (
										<button
											key={playlist.playlistId}
											onClick={() => handleAddToPlaylist(playlist.playlistId)}
											disabled={addingTo === playlist.playlistId}
											className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-left disabled:opacity-50"
										>
											<div>
												<p className="font-semibold text-white">{playlist.name}</p>
												<p className="text-sm text-gray-400">
													{playlist.itemCount} {playlist.itemCount === 1 ? 'item' : 'items'}
												</p>
											</div>
											{addingTo === playlist.playlistId ? (
												<Loader className="animate-spin text-white" size={20} />
											) : (
												<Plus className="text-gray-400" size={20} />
											)}
										</button>
									))}
								</div>
							
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default AddToPlaylistModal;