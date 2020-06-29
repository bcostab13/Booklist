# Booklist

This project contains an App where you can add books that you want to read soon. Its my **Capstone Project** from [Udacity Cloud Developer Nanodegree](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990), based on a serverless architecture. It contains the following folders:

* [**Front-End : booklist-client**](https://github.com/bcostab13/Booklist/tree/develop/booklist-client)
* [**Back-End : booklist-backend**](https://github.com/bcostab13/Booklist/tree/develop/booklist-backend)
* [**Screenshots and Others : Resources-Screenshots**](https://github.com/bcostab13/Booklist/tree/develop/Resources-Screenshots)

# Booklist Features
Booklist App have the features listed below:
* **Auth**: You can login with your own account and nobody can access to your account.
* **Add a Book**: You can add a book to your list so you can remember it whenever.
* **List Books**: View all your saved book.
* **Add a cover**: You can upload a photo of the cover of the book.
* **Check your dones**: You can mark books you already read.
* **Delete Books**: Discard book that you dislike.

If you want to see a demo, you can see a video in **Resources-Screenshots/App-Demo** folder.

# Pre-Requisites
To deploy the project locally you need to setup up items listed below:
* Node.js and NPM
* React
* Serverless Framework
* AWS Account
* Auth0 account and application (look **Resources-Screenshots/Auth0 folder**)

# Setup Local Environment
## Run Client Services
To run the react client, open booklist-client from your favorite terminal and execute:
```
npm install
```
Then, run the application with:
```
npm start
```
**Important**
This code use my backend that will be deleted soon, you should configure your own API Gateway so you have to edit [config.ts](https://github.com/bcostab13/Booklist/blob/develop/booklist-client/src/config.ts), like this:
```
const apiId = <your api id>
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
export const authConfig = {
	domain: <your auth0 domain>,
	clientId: <your auth0 domain>,
	callbackUrl: 'http://localhost:3000/callback'
}
```


## Deploy Backend
To deploy backend, you should have Serverless CLI (sls). Open booklist-backend in an editor and run:
```
npm install
```
Then, to deploy, run:
```
sls deploy -v
```
