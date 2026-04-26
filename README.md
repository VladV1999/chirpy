Chirpy -- A RESTful social media backend built with TypeScript and Express!

You will need to install Node to at least version 21.7.0
Along with PostgreSQL.

To get started run, in this order:
git clone https://github.com/VladV1999/Chirpy
npm install
npm run dev

as for the database...
Chirpy uses Postgres, so you will have to install postgres on your machine,
as well as add your link to it to DATABASE_URL to your .env file.

Some that this API provides

POST /api/users:
You will need to provide an email and a password in order to register within the database!
After that, you will receive a response with the password emitted of course, 
to signify that you have been registered!

POST /api/login:
You will need to provide an email and a password in order to authenticate that you are the real user!
After that, you will receive a valid JWT with which you can make chirps!

GET /api/chirps:
This query has two optional parameters, that is, the author's id, and the sort order for the chirps!
if you wish to see all the tweets from a specific author, you can make a single get
and then you could pull that user's ID!
As for the sort, the sort query parameter accepts asc or desc, based on the the time for the chirps' creation

POST /api/chirps:
For this endpoint, you will only have to provide the body of the chirp that you wish to post!
On a successful chirp, you will get the tweet back, signaling that it was successful!

DELETE /api/chirps/:chirpId
For this endpoint, you will have to provide the chirpId in the url parameter,
On a successful chirp delete, you will get back a status 204, but nothing in the body, as that is the standard.

---------------------------------------------------------------------------------------------------------------------

The stack that I use is:
Language: TypeScript
Framework: Express.js
Database: PostgreSQL with Drizzle ORM
Authentication: JWT(JSON Web Tokens) and Argon2 for hashing

This project was a guided project with Boot.dev that taught me many request types, taught me of express,
and taught me how to structure my servers, and have a healthy back-end!

Overall, I will use this project as the base to boost my future projects forward, and show I can keep on moving forward,
and always building better software!