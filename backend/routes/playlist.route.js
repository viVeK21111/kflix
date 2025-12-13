// playlist.route.js
import express from 'express';
import { 
	createPlaylist, 
	getAllPlaylists, 
	deletePlaylist,
	renamePlaylist,
	addItemToPlaylist,
	removeItemFromPlaylist,
	getPlaylistItems,
	initializeDefaultPlaylists
} from '../controllers/playlist.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Initialize default playlists (Movies & TV Shows) - call once on signup/login
router.post('/initialize', protectRoute, initializeDefaultPlaylists);

// Playlist CRUD
router.post('/create', protectRoute, createPlaylist);
router.get('/all', protectRoute, getAllPlaylists);
router.delete('/:playlistId', protectRoute, deletePlaylist);
router.put('/:playlistId/rename', protectRoute, renamePlaylist);

// Add/Remove items to/from playlist
router.post('/:playlistId/add', protectRoute, addItemToPlaylist);
router.delete('/:playlistId/remove', protectRoute, removeItemFromPlaylist);

// Get playlist items
router.get('/:playlistId/items', protectRoute, getPlaylistItems);

export default router;