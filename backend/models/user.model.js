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
		required: function() {
			return !this.auth0Id; // Password is required only if not using Auth0
		},
	},
	auth0Id: {
		type: String,
		unique: true,
		sparse: true,
	},
	image: {
		type: String,
		default: "",
	},
	created : {
		type : Date,
		default: Date.now,
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
	}
});

export const User = mongoose.model("User", userSchema);
