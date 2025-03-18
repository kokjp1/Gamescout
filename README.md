# GameScout documentation

## Short introduction

GameScout is the go-to app for gamers looking to discover their next favorite game. With powerful filters and search options, users can easily find games that match their preferences. Whether you're into fast-paced shooters, deep RPGs, or relaxing indie titles, GameScouter helps you explore a world of possibilities.

Beyond discovery, GameScout also offers personalized features like profiles and bookmarks. Users can save games they want to play later, build a collection of favorites, and keep track of exciting new releases. With GameScouter, finding and organizing your next gaming adventure has never been easier.

## Installation guide

‼️*Make sure you have Node.JS (with NPM) installed and up to date before installing GameScout*

1. Clone repository **OR** download ZIP
   1.a. Unzip the file
2. run `npm install` in the terminal
3. set up the database
   3.a. In mongoDB create a database named "Users" with a collection called "userAccounts"
   3.b. Copy/remember your database credentials (Also accessible under User Accounts in the leftside nav bar)
   3.c. Copy/remember the database host (ends in mongodb.net)
4. Create your own `.env` file in the root directory
   4.a. Use the file structure below, or refer to [.env example file](.env.example) > <details><summary>.env file structure</summary> > <code>DB_USERNAME=//yourOwnUsername<br> > DB_PASSWORD=//yourOwnPassword<br> > DB_HOST=//yourOwnMongoHost<br> > DB_NAME=Users<br> > DB_COLLECTION=userAccounts<br> > PORT=//YourOwnPort<br> > APIKEY=//yourOwnApiKey</code>
   </details>
5. API (_work in progress_)

## Usage guide

‼️start server / use gamescout => `npx nodemon server.js`
❌ end server / stop gamescout => `control + c` (mac & windows)

## Tools & Languages

- **Node.JS**

- `.EJS , .CSS , .JS , .JSON , .ENV `

- ├── bcrypt@5.1.1
  ├── bcryptjs@3.0.2
  ├── dotenv@16.4.7
  ├── ejs@3.1.10
  ├── eslint@9.21.0
  ├── express@4.21.2
  ├── hash@0.2.1
  ├── listjs@0.1.1
  ├── mongodb@6.13.1
  ├── nodemon@3.1.9
  └── xss@1.0.15

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

## Contributors

James K.
Braham R.
Justin A.
Thijs D.
