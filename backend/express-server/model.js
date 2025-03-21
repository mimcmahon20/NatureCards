/**
 * Blueprint for the data
 */
// Import mongoose library
const mongoose = require('mongoose');

/**
 * Card Schema (embedded subdocument within User)
 * 
 * - creator:  _id of the user who originally created the card
 * - owner:    _id of the user who currently owns/holds the card
 * - common_name: the common name of the plant
 * - scientific_name: the scientific name of the plant
 * - fun_fact: fun fact about the plant
 * - time_created: time the card was created
 * - location: where the plant was found should be kept to a general region
 * - rarity: the rarity of the card (common, rare, epic, legendary)
 * - trade_status: a boolean that is true if the card is up for trade and false if it is not this is for the
 * purpose of ensuring that a card that is in a pending request cannot be added to another trade request
 * - info_link: a link to detailed information about the plant
 * - image: a link to the corresponding image of the plant (not sure how this link will be generated need to talk to Maguire)
 */
const CardSchema = new mongoose.Schema({
    creator: { 
        // Schema.Types.ObjectId is the data type that represents the special _id field (hex-string IDs)
        type: Schema.Types.ObjectId, 
        // ref: tells Mongoose that this particular ObjectId is associated with a certain model
        ref: 'User', 
        // Mongoose will validate that the field exists before saving
        required: true 
    },
    owner: { 
        type: Schema.Types.ObjectId,
        ref: 'User', // this owner field refernces the _id of a document in User collection
        required: true 
    },
    common_name: { 
        type: String, 
        required: true 
    },
    scientific_name: { 
        type: String,
        required: true  
    },
    fun_fact: { 
        type: String 
    },
    time_created: {
        type: Date,
        default: Date.now
    },
    location: { 
        type: String 
    },
    rarity: { 
        type: String 
    },
    trade_status: { 
        type: Boolean, 
        default: false 
    },
    info_link: { 
        type: String 
    },
    image: { 
        type: String 
    }
}, {_id: false}); // _id is false since each card is stored as subdocument inside the user document

/**
 * Trade Schema
 * - offeredCard: the card being offered for trade
 * - requestedCard: the card requested for trade
 */
const TradeSchema = new mongoose.Schema({
    offeredCard: CardSchema,
    requestedCard: CardSchema
}, {_id: false});

/**
 * User Schema
 * 
 * - username: unique name for the user
 * - password: store hashed password
 * - email:    user’s email
 * - cards:    array of embedded Card documents
 * - friends:  array of user _ids referencing other Users
 * - trading:  array of embedded trade request objects
 */
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // ensures that only one user document can have a particular username (no duplicates allowed)
    },
    password: {
        type: String, // hashed
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    cards: [CardSchema],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }], 
    trading: [TradeSchema]
});

// Export Schema
module.exports = mongoose.model('UserSchema', UserSchema, 'Users')