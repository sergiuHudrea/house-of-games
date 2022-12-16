# Northcoders House of Games API

## Instructions to run the project locally

Clone the repository to your local machine with:

```
git clone https://github.com/sergiuHudrea/house-of-games.git
```

Create a .env.test file containing:

```
PGDATABASE=nc_games_test
```

Create a .env.development file containing:

```
PGDATABASE=nc_games
```

In order to install all dependencies needed, run:

```
npm install
```

Input the folowing for setting up the local database and seeding it:

```
setup-dbs

seed
```

For running tests, use:

```
npm test <file_on_which_you_have_the_tests>
```

Finally, the project to run you will need the minimum versions of `Node.js` v19.0.0. and of `Postgres` 14.6.

## Link for the hosted version

### [House of Games](https://house-of-games.onrender.com/api)


## Summary
This project represents the backend development of my first Web Page. 

`House of Games` is a board games review Web Page with various endpoints. 

The platform will enable the user to see various reviews, comments, users and categories of board games. Moreover the user will be able to vote reviews, but also to post and delete comments.

 The `description of all endpoints` can be found on the [/api](https://house-of-games.onrender.com/api) endpoint.






