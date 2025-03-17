# JsonEndPoint Examples

The JSON files provided in this directory are mean to replicate the data that will be communicated upon successful request to the frontend. Each JSON file represents and endpoint as follows:

## signin-login.json

The `/signin-login` endpoint would return from a GET request the email and password (hashed) to authenticate user login.

## signin-signup.json

The `/signin-signup` endpoint would perform a POST request providing the new user's email, username, and password (hashed) to be used to verify future login.

FOR SIGN UP:
signin-signup POST endpoint creates a new document on the database (esentially creates new user). And returns the ok status.

FOR LOG IN:
signin-login GET endpoint that returns the email and password of the corresponding player if successful. If not returns bad status (player does not exist)

FOR FORGOT PASSWORD:
No endpoint

FOR ADVENTURE:
The idea is each person on the team will have to add every other person. i.e. in a team of guido, travis, catherine. Guido on his device has to add travis and catherine, travis on his device has to add guido and catherine, etc. Basically teams are local so if you're in a group you have to each create the team (MVP). Endpoint-wise we only need to use the CREATE-CARD POST endpoint. The team members will be stored in a variable in the front-end. Whenever someone takes a photo, it will create the card for the creator and then use that information to do similar CREATE-CARD calls for the other players (changing the owner variable).
To display the list of available friends to add to the team call the FRIENDS GET route. This will return the array of friends of a player.

FOR THE FEED:
No endpoint required. Idea is front end can go into the friend array (which is part of the player) and go into each friend's card array and find cards that have been collected recently to display on the feed asynchronously.
This is because each user will have a different feed and your cards won't show up on your own feed.

FOR THE GALLERY:
The gallery endpoint is a GET endpoint that requires the specific user's id. It then will return the card array of that user
This allows for the gallery page, the view profile page gallery portion, and the viewing of a specific card. This is with the assumption when the GET is called the card array is stored in a variable and can be accessed later.

FOR THE VIEW PROFILE:
The PROFILE GET endpoint returns a user's information based on an id, you would then use the GALLERY endpoint to get the card array for that user.

FOR TRADING
You select a friend (FRIENDS route). You then see both gallery's (GALLERY route twice, once for each user and then the profile call on the friend). You choose a card from each. Trade get's added to each person through the (TRADE-CREATE route).

For the creator you can view that it's pending and for the reciever you have to say yes or no (front-end's problem)

Once rejected use the sender's (first card) card to get their ID and then call TRADE-UPDATE route to delete the trade from the sender's array and then use the same route to delete from the decliner's array.

or accepted front end will use use the owner of the cards (playerID) to run the GALLERY route to get both user's galleries into variables. They will then swap the cards and push the updated card arrays to each user using the GALLERY-UPDATE route.
It would then call the TRADE-UPDATE route on both user's to delete the trade request.
