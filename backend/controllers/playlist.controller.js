// playlist.controller.js
import { User } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';

// Initialize default playlists (Movies & TV Shows)
export const initializeDefaultPlaylists = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		// Check if default playlists already exist
		const hasMoviesPlaylist = user.playlists.some(p => p.playlistId === 'movies');
		const hasTvPlaylist = user.playlists.some(p => p.playlistId === 'tv-shows');

		if (hasMoviesPlaylist && hasTvPlaylist) {
			return res.json({ success: true, message: 'Default playlists already exist' });
		}

		const defaultPlaylists = [];

		if (!hasMoviesPlaylist) {
			defaultPlaylists.push({
				playlistId: 'movies',
				name: 'Movies',
				isDefault: true,
				type: 'movie',
				items: []
			});
		}

		if (!hasTvPlaylist) {
			defaultPlaylists.push({
				playlistId: 'tv-shows',
				name: 'TV Shows',
				isDefault: true,
				type: 'tv',
				items: []
			});
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: { playlists: { $each: defaultPlaylists } }
		});

		res.json({ success: true, message: 'Default playlists initialized' });
	} catch (error) {
		console.error('Error initializing playlists:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Create a new playlist
export const createPlaylist = async (req, res) => {
	const { name, type = 'mixed' } = req.body;

	if (!name || name.trim() === '') {
		return res.status(400).json({ success: false, message: 'Playlist name is required' });
	}

	try {
		const user = await User.findById(req.user._id);

		// Check if playlist with same name exists
		const exists = user.playlists.some(p => p.name.toLowerCase() === name.toLowerCase());
		if (exists) {
			return res.status(400).json({ success: false, message: 'Playlist with this name already exists' });
		}

		const newPlaylist = {
			playlistId: uuidv4(),
			name: name.trim(),
			isDefault: false,
			type,
			items: []
		};

		await User.findByIdAndUpdate(req.user._id, {
			$push: { playlists: newPlaylist }
		});

		res.json({ success: true, message: 'Playlist created successfully', playlist: newPlaylist });
	} catch (error) {
		console.error('Error creating playlist:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Get all playlists
export const getAllPlaylists = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		
		// Return playlists with item count
		const playlists = user.playlists.map(p => ({
			playlistId: p.playlistId,
			name: p.name,
			isDefault: p.isDefault,
			type: p.type,
			itemCount: p.items.length,
			createdAt: p.createdAt
		}));

		res.json({ success: true, playlists });
	} catch (error) {
		console.error('Error getting playlists:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Delete a playlist
export const deletePlaylist = async (req, res) => {
	const { playlistId } = req.params;

	try {
		const user = await User.findById(req.user._id);
		const playlist = user.playlists.find(p => p.playlistId === playlistId);

		if (!playlist) {
			return res.status(404).json({ success: false, message: 'Playlist not found' });
		}

		// Prevent deleting default playlists
		if (playlist.isDefault) {
			return res.status(400).json({ success: false, message: 'Cannot delete default playlists' });
		}

		await User.findByIdAndUpdate(req.user._id, {
			$pull: { playlists: { playlistId } }
		});

		res.json({ success: true, message: 'Playlist deleted successfully' });
	} catch (error) {
		console.error('Error deleting playlist:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Rename a playlist
export const renamePlaylist = async (req, res) => {
	const { playlistId } = req.params;
	const { name } = req.body;

	if (!name || name.trim() === '') {
		return res.status(400).json({ success: false, message: 'Playlist name is required' });
	}

	try {
		const user = await User.findById(req.user._id);
		const playlist = user.playlists.find(p => p.playlistId === playlistId);

		if (!playlist) {
			return res.status(404).json({ success: false, message: 'Playlist not found' });
		}

		// Prevent renaming default playlists
		if (playlist.isDefault) {
			return res.status(400).json({ success: false, message: 'Cannot rename default playlists' });
		}

		// Check if name already exists
		const exists = user.playlists.some(p => 
			p.playlistId !== playlistId && p.name.toLowerCase() === name.toLowerCase()
		);
		if (exists) {
			return res.status(400).json({ success: false, message: 'Playlist with this name already exists' });
		}

		await User.findByIdAndUpdate(
			req.user._id,
			{ $set: { 'playlists.$[elem].name': name.trim() } },
			{ arrayFilters: [{ 'elem.playlistId': playlistId }] }
		);

		res.json({ success: true, message: 'Playlist renamed successfully' });
	} catch (error) {
		console.error('Error renaming playlist:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Add item to playlist
export const addItemToPlaylist = async (req, res) => {
	const { playlistId } = req.params;
	const { type, id, image, title, season, episode, name, totalEpisodes } = req.body;

	if (!type || !id) {
		return res.status(400).json({ success: false, message: 'Type and ID are required' });
	}

	try {
		const user = await User.findById(req.user._id);
		const playlist = user.playlists.find(p => p.playlistId === playlistId);

		if (!playlist) {
			return res.status(404).json({ success: false, message: 'Playlist not found' });
		}

		// Check if item already exists
		const exists = playlist.items.some(item => {
			if (type === 'tv' && season !== undefined && episode !== undefined) {
				return item.id === id && item.season === season && item.episode === episode;
			}
			return item.id === id && item.type === type;
		});

		if (exists) {
			return res.json({ success: false, message: 'Item already in playlist' });
		}

		const newItem = {
			type,
			id: parseInt(id),
			image,
			title,
			addedAt: new Date()
		};

		// Add TV-specific fields
		if (type === 'tv' && season !== undefined && episode !== undefined) {
			newItem.season = parseInt(season);
			newItem.episode = parseInt(episode);
			newItem.name = name;
			newItem.totalEpisodes = parseInt(totalEpisodes);
		}

		await User.findByIdAndUpdate(
			req.user._id,
			{ $push: { 'playlists.$[elem].items': newItem } },
			{ arrayFilters: [{ 'elem.playlistId': playlistId }] }
		);

		res.json({ success: true, message: `Added to ${playlist.name}` });
	} catch (error) {
		console.error('Error adding item to playlist:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Remove item from playlist
export const removeItemFromPlaylist = async (req, res) => {
	const { playlistId } = req.params;
	const { type, id, season, episode } = req.body;

	try {
		const pullQuery = {
			type,
			id: parseInt(id)
		};

		// Add season/episode for TV episodes
		if (type === 'tv' && season !== undefined && episode !== undefined) {
			pullQuery.season = parseInt(season);
			pullQuery.episode = parseInt(episode);
		}

		await User.findByIdAndUpdate(
			req.user._id,
			{ $pull: { 'playlists.$[elem].items': pullQuery } },
			{ arrayFilters: [{ 'elem.playlistId': playlistId }] }
		);

		res.json({ success: true, message: 'Removed from playlist' });
	} catch (error) {
		console.error('Error removing item from playlist:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Get playlist items
export const getPlaylistItems = async (req, res) => {
	const { playlistId } = req.params;

	try {
		const user = await User.findById(req.user._id);
		const playlist = user.playlists.find(p => p.playlistId === playlistId);

		if (!playlist) {
			return res.status(404).json({ success: false, message: 'Playlist not found' });
		}

		res.json({ 
			success: true, 
			playlist: {
				playlistId: playlist.playlistId,
				name: playlist.name,
				type: playlist.type,
				isDefault: playlist.isDefault,
				items: playlist.items
			}
		});
	} catch (error) {
		console.error('Error getting playlist items:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};