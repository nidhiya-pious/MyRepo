const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
	urlCode: String,
	longUrl: String,
	shortUrl: String,
	craetedAt: {
		type: Date,
        default: Date.now
    }
	// },
	// numberOfVisits: {
	// 	type: Number,
	// 	required: true,
	// 	default: 0
	// }
});
module.exports = mongoose.model('Url', urlSchema);