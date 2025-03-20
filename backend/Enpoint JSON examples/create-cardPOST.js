/**
 * Sample JSON format for the POST route
 * You will need to provide the following in the request body:
 * creator - id of the card creator (_id)
 * owner - id of the card owner (_id)
 * common_name - common name of plant (String)
 * scientific_name - scientific name of plant (String)
 * fun_fact - fun fact about plant (String)
 * time_created - date and time the plant was created (Date object)
 * location - location plant was found (String)
 * rarity - rarity of the captured plant (String)
 * trade_status - trade status of the card (Boolean)
 * info_link - plant information URL (String)
 * image - plant image URL (String)
 */
const example_request = {
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