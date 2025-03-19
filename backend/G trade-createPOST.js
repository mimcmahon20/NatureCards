/**
 * You will need to provide the following in the request body:
 *      _id - the id of the user initiating the trade
 *      _id2 - the id of the user recieving the trade
 *      tid - an id for the trade so that it can be found in a list and removed
 *      card1 - the first card object to be given from user1
 *      card2 - the second card object from user2 to be recieved from by user1
 * 
 * Sample JSON output after adding the trade object
 * trading - the trading array of trade objects that is returned after the request is successful
 */
const example_response = {
    "trading": [
        {
            "tid": "unique_trade_id", // Unique ID for the trade
            "card1": {
                "creator": "_id",
                "owner": "_id",
                "common_name": "String",
            },
            "card2": {
                "creator": "_id",
                "owner": "_id",
                "common_name": "String",
            }
        }
    ]
}