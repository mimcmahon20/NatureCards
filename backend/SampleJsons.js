/**
 * This is the top level, as in what's stored in each document for each user.
 * - _id is what's stored automatically by MongoDB for each new document.
 * - username: username.
 * - Password: passowrd hashed for security. But might not need this based on Matthew's auth suggestion.
 * - Email: email.
 * - cards_owned: This is an array of cards that stores every card that the user owns. For a card example see
 * "cardExample" below
 * - friends: this will be a list that stores the "_id" of each friended user in an array
 * - trading_requests: This will be an array of card pairs that the user has requested to trade. The idea is that the
 * initiating user would pick a card they want to send to a friend and then pick a card they want from the friend's
 * gallery and send that request to them.
 */
const userExample = {
  _id: "ObjectID",
  username: "String",
  password: "String (hashed)",
  email: "String",
  cards_owned: ["Card", "Card"],
  friends: ["Player_id", "Player_id"],
  trading_requests: [
    ["Card", "Card"],
    ["Card", "Card"],
  ],
};

const cardExample = {
  _id: "ObjectID",
  creator: "String",
  owner: "String",
  common_name: "String",
  scientific_name: "String",
  fun_fact: "String",
  time_created: "DateTime",
  location: "String",
  rarity: "String",
  trade_status: "String",
  info_link: "String",
  image: "String",
};
