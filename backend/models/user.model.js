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
	image: {
		type: String,
		default: "",
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
	}
});

export const User = mongoose.model("User", userSchema);
