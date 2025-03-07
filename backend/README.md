# JsonEndPoint Examples

The JSON files provided in this directory are mean to replicate the data that will be communicated upon successful request to the frontend. Each JSON file represents and endpoint as follows:

## signin-login.json

The `/signin-login` endpoint would return from a GET request the email and password (hashed) to authenticate user login.

## signin-signup.json

The `/signin-signup` endpoint would perform a POST request providing the new user's email, username, and password (hashed) to be used to verify future login.
