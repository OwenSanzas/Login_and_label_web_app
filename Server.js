const express = require('express');
const config = require('./config.json');
const routes = require('./Routes.js');
const cors = require('cors');
const bodyParser = require('body-parser');

// load express.js into app
const app = express();


// A safer method
app.use(cors({ credentials: true, origin: '*' }));


/*
----------------------------------------------
                Routes for testing
----------------------------------------------
*/
app.get('/author', routes.testAuthor);


/*
----------------------------------------------
              Routes for Main Page
----------------------------------------------
*/

app.get('/login', routes.checkPassword);
app.get('/getLabels',routes.getLabels);
app.use(bodyParser.json());
app.delete('/deleteLabels',routes.deleteLabels);
app.post('/addLabels',routes.addLabels);
app.put('/updateLabels',routes.updateLabels);



app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});


