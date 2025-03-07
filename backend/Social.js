// Player data object
const playerData = {
    root: [
        {
            // Array of friends' objects associated with the player
            friends: [
                {
                    // Unique identifier for the friend
                    player_id: "60f7a2b9...",
                    // Friend's username
                    username: "user1"
                },
                {
                    // Unique identifier for the friend
                    player_id: "70g8b3c0...",
                    // Friend's username
                    username: "user2"
                }
            ],
            // Array of trading requests associated with the player
            trading_requests: [
                [
                    {
                        // Unique identifier for the plant card
                        _id: "6123...",
                        // The creator of the plant card
                        creator: "user1",
                        // The current owner of the plant card
                        owner: "user1",
                        // The common name of the plant
                        common_name: "some common name.",
                        // The scientific name of the plant
                        scientific_name: "some scientific name",
                        // A fun fact related to the plant
                        fun_fact: "iosdjosid",
                        // Timestamp of when the plant card was created
                        time_created: "2025-03-05T12:34:56Z",
                        // Location where the plant was found
                        location: "Blacksburg",
                        // Rarity level of the plant card
                        rarity: "Rare",
                        // Current trade status of the plant card
                        trade_status: "Trading",
                        // Link to more information about the plant
                        info_link: "some link",
                        // Link to the image of the plant
                        image: "some image link"
                    }
                ],
                [
                    {
                        // Unique identifier for the plant card
                        _id: "7234...",
                        // The creator of the plant card
                        creator: "user2",
                        // The current owner of the plant card
                        owner: "user2",
                        // The common name of the plant
                        common_name: "another common name",
                        // The scientific name of the plant
                        scientific_name: "another scientific name",
                        // A fun fact related to the plant
                        fun_fact: "djsidjso",
                        // Timestamp of when the plant card was created
                        time_created: "2025-03-06T14:22:18Z",
                        // Location where the plant was found
                        location: "Richmond",
                        // Rarity level of the plant card
                        rarity: "Common",
                        // Current trade status of the plant card
                        trade_status: "Not Trading",
                        // Link to more information about the plant
                        info_link: "another link",
                        // Link to the image of the plant
                        image: "another image link"
                    }
                ]
            ]
        }
    ]
};

// Export the playerData object to make it accessible in other files
export default playerData;
