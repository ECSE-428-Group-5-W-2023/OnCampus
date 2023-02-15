# OnCampus
This is the main repository for the Group 5 ECSE 428 project, Winter 2023

# Requirements
The minimum requirement is having [docker](https://www.docker.com/products/docker-desktop) installed locally.

If you also want to run everything locally you will need

`node v14.17.0 or higher`

`npm v6.14.13 or higher`

lower might work this is just what I am running

# How to run
You can choose to handle the db on your local machine and also run everything locally but it might become tricky to do so as people update the schema.
Docker allows us to quickly spin up a postgres db that matches whatever we have in ./db/database.sql

One this to note is that docker doesn't remove the db's data automatically so when you want to "update" it to match any changes in database.sql you will have to run the following

`docker-compose down --rmi all && docker-compose up db`

if you simply want to bring the db up:

`docker-compose up db`

For running the backend and the frontend you have two options. The easiest is to simply use docker-compose and run 

`docker-compose up`

and if you need to rebuild (because you updated the dependencies for example)

`docker-compose up --build`

You can also run them locally (better speed and more control)

in ./backend

`npm i`

`npm run start`

in ./web

`npm i`

`npm run start`

