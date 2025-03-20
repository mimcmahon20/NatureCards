/**
 * Sample JSON format for the POST route
 * You will need to provide the following in the request body:
 * username - user's name
 * email - user's email
 * test - user's password
 */
const gallery_request = {
    "username": "user1",
    "email": "naturelover@gmail.com",
    "test": "jaskdnf2334n@#%nadfns"
  }
  
  /**
   * Sample JSON format after sigining up
   * _id - player id (ObjectID)
   * username - player's username
   * cards - empty card array for new player
   * friends - empty friend array for new player
   * trading - empty trading array for new player
  */
  const gallery_response = {
    "_id": ObjectId("12347"), // unique identifier for the user
    "username": "nature_lover2", // user's name
    "cards": [],
    "friends":[],
    "trading":[],
  }
  