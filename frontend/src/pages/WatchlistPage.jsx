import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import axios from "axios";
import { SquareX, Loader, Plus, Trash2, Edit2, Check, X, MoreVertical } from 'lucide-react';
import toast from "react-hot-toast";

const WatchlistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistItems, setPlaylistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);
  
  // Create playlist states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);
  
  // Rename playlist states
  const [renamingPlaylistId, setRenamingPlaylistId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  
  // Three dot menu state
  const [showMenuFor, setShowMenuFor] = useState(null);

  useEffect(() => {
    initializeAndFetchPlaylists();
  }, []);

  const initializeAndFetchPlaylists = async () => {
    try {
      setLoading(true);
      // Initialize default playlists
      await axios.post('/api/v1/playlist/initialize');
      
      // Fetch all playlists
      const res = await axios.get('/api/v1/playlist/all');
      if (res.data.success) {
        setPlaylists(res.data.playlists);
        
        // Check if there's a saved playlist in sessionStorage
        const savedPlaylistId = sessionStorage.getItem('selectedPlaylist');
        
        if (savedPlaylistId && res.data.playlists.some(p => p.playlistId === savedPlaylistId)) {
          // If saved playlist exists, select it
          selectPlaylist(savedPlaylistId);
        } else if (res.data.playlists.length > 0) {
          // Otherwise, select first playlist
          selectPlaylist(res.data.playlists[0].playlistId);
        }
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const selectPlaylist = async (playlistId) => {
    try {
      setItemsLoading(true);
      setSelectedPlaylist(playlistId);
      
      // Save to sessionStorage
      sessionStorage.setItem('selectedPlaylist', playlistId);
      
      setDisplayCount(10);
      
      const res = await axios.get(`/api/v1/playlist/${playlistId}/items`);
      if (res.data.success) {
        setPlaylistItems(res.data.playlist.items);
      }
    } catch (error) {
      console.error('Error fetching playlist items:', error);
      toast.error('Failed to load playlist items');
    } finally {
      setItemsLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    
    if (!newPlaylistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    try {
      setCreating(true);
      const res = await axios.post('/api/v1/playlist/create', {
        name: newPlaylistName.trim(),
        type: 'mixed'
      });

      if (res.data.success) {
        toast.success('Playlist created!');
        
        // Add new playlist to state immediately
        const newPlaylist = {
          ...res.data.playlist,
          itemCount: 0
        };
        setPlaylists(prev => [...prev, newPlaylist]);
        
        setNewPlaylistName('');
        setShowCreateDialog(false);
        
        // Auto-select the new playlist
        selectPlaylist(newPlaylist.playlistId);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePlaylist = async (playlistId, playlistName) => {
    if (!confirm(`Delete "${playlistName}"?`)) return;

    try {
      const res = await axios.delete(`/api/v1/playlist/${playlistId}`);
      if (res.data.success) {
        toast.success('Playlist deleted');
        
        // Remove playlist from state immediately
        const updatedPlaylists = playlists.filter(p => p.playlistId !== playlistId);
        setPlaylists(updatedPlaylists);
        
        // If deleted playlist was selected, select first available playlist
        if (selectedPlaylist === playlistId) {
          if (updatedPlaylists.length > 0) {
            selectPlaylist(updatedPlaylists[0].playlistId);
          } else {
            setSelectedPlaylist(null);
            setPlaylistItems([]);
            sessionStorage.removeItem('selectedPlaylist');
          }
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
    }
  };

  const handleRenamePlaylist = async (playlistId) => {
    if (!renameValue.trim()) {
      toast.error('Please enter a new name');
      return;
    }

    try {
      const res = await axios.put(`/api/v1/playlist/${playlistId}/rename`, {
        name: renameValue.trim()
      });

      if (res.data.success) {
        toast.success('Playlist renamed');
        
        // Update playlist name immediately
        setPlaylists(prevPlaylists =>
          prevPlaylists.map(p =>
            p.playlistId === playlistId
              ? { ...p, name: renameValue.trim() }
              : p
          )
        );
        
        setRenamingPlaylistId(null);
        setRenameValue('');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error renaming playlist:', error);
      toast.error('Failed to rename playlist');
    }
  };

  const removeFromPlaylist = async (item) => {
    try {
      const payload = {
        type: item.type,
        id: item.id
      };

      if (item.season !== undefined && item.episode !== undefined) {
        payload.season = item.season;
        payload.episode = item.episode;
      }

      const res = await axios.delete(`/api/v1/playlist/${selectedPlaylist}/remove`, {
        data: payload
      });

      if (res.data.success) {
        toast.success('Removed from playlist');
        
        // Update playlist items immediately (optimistic update)
        const updatedItems = playlistItems.filter(pItem => {
          if (item.season !== undefined && item.episode !== undefined) {
            return !(pItem.id === item.id && pItem.season === item.season && pItem.episode === item.episode);
          }
          return pItem.id !== item.id;
        });
        setPlaylistItems(updatedItems);
        
        // Update the playlist count in the sidebar
        setPlaylists(prevPlaylists => 
          prevPlaylists.map(p => 
            p.playlistId === selectedPlaylist 
              ? { ...p, itemCount: p.itemCount - 1 }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
      // Refetch on error to sync state
      selectPlaylist(selectedPlaylist);
    }
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 5);
  };

  const loadLess = () => {
    setDisplayCount(prev => Math.max(10, prev - 5));
  };

  const currentPlaylist = playlists.find(p => p.playlistId === selectedPlaylist);

  return (
    <div className="w-full min-h-screen bg-gray-900">
      <div className="w-full flex flex-1 min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex md:flex-col w-64 bg-gray-800 p-4 h-screen sticky top-0 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-xl font-bold">Library</h2>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
              title="Create new playlist"
            >
              <Plus size={20} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <Loader className="animate-spin text-white" size={24} />
            </div>
          ) : (
            <nav className="flex flex-col gap-2">
              {playlists.map((playlist) => (
                <div key={playlist.playlistId} className="relative group">
                  {renamingPlaylistId === playlist.playlistId ? (
                    <div className="flex items-center gap-1 bg-gray-700 p-2 rounded-lg">
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleRenamePlaylist(playlist.playlistId)}
                        className="text-green-500 hover:text-green-400"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setRenamingPlaylistId(null);
                          setRenameValue('');
                        }}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => selectPlaylist(playlist.playlistId)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition ${
                        selectedPlaylist === playlist.playlistId
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-gray-200 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex min-w-full">
                        <span className="block truncate">{playlist.name}</span>
                        <span className="ml-auto text-gray-300">{playlist.itemCount}</span>
                      </div>
                      
                     
                    </button>
                  )}
                </div>
              ))}
            </nav>
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-1 bg-gray-900 min-h-0 lg:overflow-y-auto">
          <div className="flex flex-col items-center">
            {/* Mobile Playlist Selector */}
            <div className="ml-auto flex items-center px-4 pt-4 lg:hidden w-full">
              <select
                value={selectedPlaylist || ''}
                onChange={(e) => selectPlaylist(e.target.value)}
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg outline-none cursor-pointer"
              >
                {playlists.map((playlist) => (
                  <option key={playlist.playlistId} value={playlist.playlistId}>
                    {playlist.name} ({playlist.itemCount})
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Section Title */}
            <div className="text-white w-full px-4 sm:px-6 max-w-6xl mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">
                  {currentPlaylist?.name || 'Playlist'}
                </h3>
                
                {/* Three Dot Menu for Current Playlist */}
                {currentPlaylist && !currentPlaylist.isDefault && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenuFor(showMenuFor === currentPlaylist.playlistId ? null : currentPlaylist.playlistId)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition"
                    >
                      <MoreVertical size={24} />
                    </button>
                    
                    {showMenuFor === currentPlaylist.playlistId && (
                      <>
                        {/* Overlay to close menu */}
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setShowMenuFor(null)}
                        ></div>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-40">
                          <button
                            onClick={() => {
                              setRenamingPlaylistId(currentPlaylist.playlistId);
                              setRenameValue(currentPlaylist.name);
                              setShowMenuFor(null);
                              setShowRenameDialog(true);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition text-left rounded-t-lg"
                          >
                            <Edit2 size={18} />
                            <span>Rename</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowMenuFor(null);
                              handleDeletePlaylist(currentPlaylist.playlistId, currentPlaylist.name);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition text-left text-red-400 hover:text-red-300 rounded-b-lg"
                          >
                            <Trash2 size={18} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {itemsLoading && (
              <div className="flex justify-center w-full items-center mt-16 h-full">
                <Loader className="animate-spin text-white w-8 h-8" />
              </div>
            )}

            {/* Empty Playlist */}
            {!itemsLoading && playlistItems.length === 0 && (
              <p className="text-gray-400 mt-6 p-3 text-lg">
                This playlist is empty. Start adding movies or TV shows! 🍿
              </p>
            )}

            {/* Content Grid */}
            {!itemsLoading && playlistItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 w-full px-4 sm:px-6 mb-2 max-w-6xl">
                {playlistItems.slice(0, displayCount).map((item, index) => (
                  <Link
                    key={`${item.id}-${item.season || ''}-${item.episode || ''}-${index}`}
                    to={
                      item.type === 'movie'
                        ? `/movie?id=${item.id}&name=${item.title}`
                        : item.season
                        ? `/watch/?id=${item.id}&name=${item.name}&season=${item.season}&episode=${item.episode}&tepisodes=${item.totalEpisodes}`
                        : `/tv/details?id=${item.id}&name=${item.title}`
                    }
                    className="group relative block bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromPlaylist(item);
                      }}
                      className="absolute top-2 right-2 rounded-full z-10"
                    >
                      <SquareX className="size-6 cursor-pointer fill-white hover:fill-red-500" />
                    </button>

                    <img
                      src={`${ORIGINAL_IMG_BASE_URL}${item.image}`}
                      className="w-full h-56 sm:h-64 object-cover rounded-lg transition-all"
                      alt={item.title}
                    />

                    <div
                      className={
                        !item.season
                          ? `absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-3 py-2`
                          : `absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-black/60 px-3 py-2`
                      }
                    >
                      {item.season && (
                        <p className="text-white font-semibold">{item.name}</p>
                      )}
                      <h3 className="text-sm sm:text-base font-bold text-white truncate">
                        {item.title}
                      </h3>
                      {item.season && (
                        <p className="text-gray-300 font-semibold">
                          S{item.season}.E{item.episode}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Load More/Less */}
            {!itemsLoading && playlistItems.length > 0 && (
              <div className="flex gap-4 mt-3 mb-10">
                {displayCount > 10 && (
                  <button
                    onClick={loadLess}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-lg transition-all"
                  >
                    Load Less
                  </button>
                )}

                {displayCount < playlistItems.length && (
                  <button
                    onClick={loadMore}
                    className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-3 rounded-lg transition-all"
                  >
                    Load More
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Playlist Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Create New Playlist</h2>
            <form onSubmit={handleCreatePlaylist}>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 outline-none"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setNewPlaylistName('');
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename Playlist Dialog */}
      {showRenameDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Rename Playlist</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleRenamePlaylist(renamingPlaylistId);
              setShowRenameDialog(false);
            }}>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder="New playlist name"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 outline-none"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  Rename
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRenameDialog(false);
                    setRenamingPlaylistId(null);
                    setRenameValue('');
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;