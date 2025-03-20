/**
 * You will need to provide the following in the request body:
 * _id - the id of the user recieving the new friend
 * friend_id - id of the friend to be added
 */

// Sample JSON input for the POST route
const example_request = {
    "_id": "12345",
    "friend_id": "67890"
}

/*
 * friends - array of friend ids 
* Sample JSON output after adding the friendId
*/
const example_response ={
    "friends": ["11111", "22222", "33333", "67890"]
}