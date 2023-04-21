# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).  App allows user to register and create a user profile.  Once registered, user can add/edit/delete URLs and store them within their own profile.  Storage of URLs and user profiles is currently limited to being stored in "database" objects within the server.  

## Final Product

!["screenshot description"](#)
!["screenshot description"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session
- crypto

## Dev Dependencies

- chai
- mocha
- nodemon

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command , or `npm start` if using nodemon
- Visit page by navigating to http://localhost:8080/ in web browser
- First will have to register a new account, then can create and store shortened URLs, as well as test login flows and page session permissions