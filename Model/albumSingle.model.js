const mongoose = require("mongoose");

//the schema to get the data
const singleSchema = new mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	singleNumber : Number,
	audio : String,
	singleTitle : {
		type : String
	},
	artists : String,
	coverArt : {
		type : String,
	},
	downloads : {
		type : Number,
		default : 0
	},
	streams : {
		type : Number,
		default : 0,
		timestamp : true
	},
	abumType: String,
	albumTitle: String,
	government : String,
	releaseDate : Date,
	genre : String,
	featuredArtists : String,
	isFeatured : Boolean,
	duration : Number
});

mongoose.model("albumTrack", singleSchema);

singleSchema.index({
		singleTitle:"text",
		description: "text"
	});