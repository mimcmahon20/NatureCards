/**
 * Sample JSON format for the POST route
 * You will need to provide the following in the request body:
 * updatedGallery - the updated card array
 */
const example_request = {
    "updatedGallery": [
        {
            "creator": 1,
            "owner": 1,
            "commonName": "Daisy",
            "scientificName": "Bellis perennis",
            "funFact": "Sunshine Daisy is the only indigenous plant to the east coast that can be used as a natural remedy to Poison Ivy.",
            "timeCreated": new Date("<2025-03-19T10:00:00Z>"),
            "location": "Blacksburg, VA",
            "rarity": "Common",
            "tradeStatus": False,
            "infoLink": "https://nature-cards-eight.vercel.app/adflsf23231", // TODO replace with properly formatted URL
            "image": "https://nature-cards-eight.vercel.app/aslkdfn234n.png", // TODO replace with properly formatted URL
        }
    ]
}