# massdrop
A Job queue that takes a url and saves the html to a database.

An express.js server serves an index.html and api endpoints for processings job requests.  The jobs are saved into a Rethinkdb database and added to a job queue using npm package 'kue'.  When the job is processed, the html from the url is saved into the content key of the rethinkdb record.

React.js is used to render the page.  It displays a list of jobs and an input for entering new urls.  Each job is linked to a page that will display the saved html.  The page makes api requests to the express.js server using the npm superagent package.  

## Dependencies
* rethinkdb (default ports)
* redis (default ports)

## Setup
* run npm start
* go to localhost:3000

 

