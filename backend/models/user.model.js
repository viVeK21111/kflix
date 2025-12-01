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
