import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	googleId: {
		type: String,
		sparse: true,
		unique: true,
	},
	provider: {
		type: String,
		default: 'local',
	},
	image: {
		type: String,
		default: "",
	},
	picture: {
		type: String,
		default: '',
	},
	created : {
		type : Date,
		
	},
	searchHistory: {
		type: Array,
		default: [],
	},
	chatHistory : {
		type:Array,
		default: [],
	},
	watchHistory: {
		type:Array,
		default:[],
	},
	watchList: {
		type: Array,
		default: [],
	},
	// NEW Playlist System
	playlists: [{
		playlistId: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		isDefault: {
			type: Boolean,
			default: false, // true for 'Movies' and 'TV Shows'
		},
		type: {
			type: String, // 'movie', 'tv', or 'mixed'
			default: 'mixed'
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		items: [{
			type: {
				type: String, // 'movie' or 'tv'
				required: true,
			},
			id: {
				type: Number,
				required: true,
			},
			image: String,
			title: String,
			// TV specific fields
			season: Number,
			episode: Number,
			name: String,
			totalEpisodes: Number,
			addedAt: {
				type: Date,
				default: Date.now,
			}
		}]
	}],
	Preferences: {
		adult: {
			type:Boolean,
			default:false
		},
	},
	flappy : {
		score : {
			type: Number,
			default: 0,
		}
	},
	galleryImages: [{
		imageUrl: {
			type: String,
			required: true,
		},
		uploadedAt: {
			type: Date,
			default: Date.now,
		},
		uploaderEmail: {
			type: String,
			required: true,
		},
		uploaderUsername: {
			type: String,
			required: true,
		}
	}]
});

export const User = mongoose.model("User", userSchema);
