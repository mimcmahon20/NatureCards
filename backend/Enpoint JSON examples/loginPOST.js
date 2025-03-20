/**
 * You will need to provide the following in the request body:
 * email - user's email
 * test - user's password
 */

// Sample JSON format for the GET route
const gallery_request = {
    "email": "naturelover@gmail.com",
    "test": "jaskdnf2334n@#%nadfns"
}

/**
 * Sample JSON format after user id
 * _id - player id (ObjectID)
 * username - player's username
 * cards - player's card array
*/
const gallery_response = {
    "_id": ObjectId("12345"), // unique identifier for the user
    "username": "nature_lover", // user's name
    "cards": [
        {
        "creator": 1, // unique identified for the plant's card
        "owner": 1, // The creator of the plant card
        "commonName": "Daisy", // The common name of the plant
        "scientificName": "Bellis perennis", // The scientific name of the plant
        "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.", // A fun fact related to the plant
        "timeCreated": new Date("<2025-03-19T10:00:00Z>"), // Timestamp of when the plant card was created
        "location": "Blacksburg, VA", // Location where the plant was found
        "rarity": "Common", // Rarity level of the plant card
        "tradeStatus": False, // Current trade status of the plant card
        "infoLink": "https://nature-cards-eight.vercel.app/adflsf23231", // Link to more information about the plant, TODO replace with properly formatted URL
        "image": "https://nature-cards-eight.vercel.app/aslkdfn234n.png", // Link to the image of the plant, TODO replace with properly formatted URL
        },
        {
        "creator": 1,
        "owner": 1,
        "commonName": "Daisy",
        "scientificName": "Bellis perennis",
        "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.",
        "timeCreated": new Date("<2025-03-20T10:00:00Z>"), 
        "location": "Blacksburg, VA", 
        "rarity": "Common", 
        "tradeStatus": False, 
        "infoLink": "https://nature-cards-eight.vercel.app/adflsf23233", // TODO replace with properly formatted URL
        "image": "https://nature-cards-eight.vercel.app/aslkdfn234p.png", // TODO replace with properly formatted URL
        },
        {
        "creator": 1,
        "owner": 1,
        "commonName": "Daisy",
        "scientificName": "Bellis perennis",
        "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.",
        "timeCreated": new Date("<2025-03-21T10:00:00Z>"),
        "location": "Blacksburg, VA",
        "rarity": "Common",
        "tradeStatus": False,
        "infoLink": "https://nature-cards-eight.vercel.app/adflsf23234", // TODO replace with properly formatted URL
        "image": "https://nature-cards-eight.vercel.app/aslkdfn234a.png", // TODO replace with properly formatted URL
        }
    ],
    "friends":[ObjectId("11111"),ObjectId("11111"),ObjectId("11111"),ObjectId("11111"),ObjectId("11111"),ObjectId("11111")],
    "trading":[
        {
            "offeredCard": {
                "creator": 1,
                "owner": 1,
                "commonName": "Daisy",
                "scientificName": "Bellis perennis",
                "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.",
                "timeCreated": new Date("<2025-03-21T10:00:00Z>"),
                "location": "Blacksburg, VA",
                "rarity": "Common",
                "tradeStatus": False,
                "infoLink": "https://nature-cards-eight.vercel.app/adflsf23234", // TODO replace with properly formatted URL
                "image": "https://nature-cards-eight.vercel.app/aslkdfn234a.png", // TODO replace with properly formatted URL
            },
            "requestedCard": {
                "creator": 2,
                "owner": 2,
                "commonName": "Daisy",
                "scientificName": "Bellis perennis",
                "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.",
                "timeCreated": new Date("<2025-03-21T10:00:00Z>"),
                "location": "Blacksburg, VA",
                "rarity": "Common",
                "tradeStatus": False,
                "infoLink": "https://nature-cards-eight.vercel.app/adflsf23234", // TODO replace with properly formatted URL
                "image": "https://nature-cards-eight.vercel.app/aslkdfn234a.png", // TODO replace with properly formatted URL
            }
        },
        {
            "offeredCard": {
                "creator": 1,
                "owner": 1,
                "commonName": "Daisy",
                "scientificName": "Bellis perennis",
                "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.",
                "timeCreated": new Date("<2025-03-21T10:00:00Z>"),
                "location": "Blacksburg, VA",
                "rarity": "Common",
                "tradeStatus": False,
                "infoLink": "https://nature-cards-eight.vercel.app/adflsf23234", // TODO replace with properly formatted URL
                "image": "https://nature-cards-eight.vercel.app/aslkdfn234a.png", // TODO replace with properly formatted URL
            },
            "requestedCard": {
                "creator": 2,
                "owner": 2,
                "commonName": "Daisy",
                "scientificName": "Bellis perennis",
                "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.",
                "timeCreated": new Date("<2025-03-21T10:00:00Z>"),
                "location": "Blacksburg, VA",
                "rarity": "Common",
                "tradeStatus": False,
                "infoLink": "https://nature-cards-eight.vercel.app/adflsf23234", // TODO replace with properly formatted URL
                "image": "https://nature-cards-eight.vercel.app/aslkdfn234a.png", // TODO replace with properly formatted URL
            }
        },
        {
            "offeredCard": {
                "creator": 1,
                "owner": 1,
                "commonName": "Daisy",
                "scientificName": "Bellis perennis",
                "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.",
                "timeCreated": new Date("<2025-03-21T10:00:00Z>"),
                "location": "Blacksburg, VA",
                "rarity": "Common",
                "tradeStatus": False,
                "infoLink": "https://nature-cards-eight.vercel.app/adflsf23234", // TODO replace with properly formatted URL
                "image": "https://nature-cards-eight.vercel.app/aslkdfn234a.png", // TODO replace with properly formatted URL
            },
            "requestedCard": {
                "creator": 2,
                "owner": 2,
                "commonName": "Daisy",
                "scientificName": "Bellis perennis",
                "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.",
                "timeCreated": new Date("<2025-03-21T10:00:00Z>"),
                "location": "Blacksburg, VA",
                "rarity": "Common",
                "tradeStatus": False,
                "infoLink": "https://nature-cards-eight.vercel.app/adflsf23234", // TODO replace with properly formatted URL
                "image": "https://nature-cards-eight.vercel.app/aslkdfn234a.png", // TODO replace with properly formatted URL
            }
        },
        {
            "offeredCard": {
                "creator": 1,
                "owner": 1,
                "commonName": "Daisy",
                "scientificName": "Bellis perennis",
                "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.",
                "timeCreated": new Date("<2025-03-21T10:00:00Z>"),
                "location": "Blacksburg, VA",
                "rarity": "Common",
                "tradeStatus": False,
                "infoLink": "https://nature-cards-eight.vercel.app/adflsf23234", // TODO replace with properly formatted URL
                "image": "https://nature-cards-eight.vercel.app/aslkdfn234a.png", // TODO replace with properly formatted URL
            },
            "requestedCard": {
                "creator": 2,
                "owner": 2,
                "commonName": "Daisy",
                "scientificName": "Bellis perennis",
                "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.",
                "timeCreated": new Date("<2025-03-21T10:00:00Z>"),
                "location": "Blacksburg, VA",
                "rarity": "Common",
                "tradeStatus": False,
                "infoLink": "https://nature-cards-eight.vercel.app/adflsf23234", // TODO replace with properly formatted URL
                "image": "https://nature-cards-eight.vercel.app/aslkdfn234a.png", // TODO replace with properly formatted URL
            }
        }
    ],
}
  