// Player data object
const playerData = {
    root: [
        {
            // Unique identifier for the player
            player_id: "60f7a2b9...",
            // Player's username
            username: "user1",
            // Array of card objects associated with the player
            cards: [
                {
                    // Unique identifier for the nature card
                    _id: "6123...",
                    // The creator of the card
                    creator: "user1",
                    // The current owner of the card
                    owner: "user1",
                    // The common name of the plant on the card
                    common_name: "some common name.",
                    // The scientific name of the plant on the card
                    scientific_name: "some scientific name",
                    // A fun fact related to the plant on the card
                    fun_fact: "iosdjosid",
                    // Timestamp of when the card was created
                    time_created: "2025-03-05T12:34:56Z",
                    // Location associated with the card
                    location: "Blacksburg",
                    // Rarity level of the card
                    rarity: "Rare",
                    // Current trade status of the card
                    trade_status: "Trading",
                    // Link to more information about the plant on the card
                    info_link: "some link",
                    // Link to the image of the plant on the card
                    image: "some image link"
                }
            ]
        }
    ]
};

// Export the playerData object to make it accessible in other files
export default playerData;
