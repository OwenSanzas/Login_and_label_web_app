// import databases:
const DBconnect = require('./DataConnection');





/*
----------------------------------------------
                Routes for testing
----------------------------------------------
*/

const testAuthor = async function (req, res) {
    let name = 'Ze Sheng'
    res.send(name);
}


/*
----------------------------------------------
             Routes for Main Page
----------------------------------------------
*/

//GET /password
const checkPassword = async function (req, res) {

    // get the username from the client
    const {
        username = "",
        inputPassword = ""
    } = req.query;

    console.log(username);
    console.log(inputPassword);

    const query = `
        SELECT password
        FROM users
        WHERE name = '${username}';
    `

    // get real password and match it with the input password
    DBconnect.query(query, (err, data) => {
        console.log(data);

        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }

        if (data.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const realPassword = data[0].password;

        if (inputPassword === realPassword) {
            res.send('Password is correct');
        } else {
            // return empty if the password doesn't match
            res.send('');
        }
    })
}


const addLabels = async function (req, res) {
    const { username, newLabel } = req.body;

    query = `
    UPDATE users
    SET labels = JSON_ARRAY_APPEND(labels, '$', '${newLabel}')
    WHERE name = '${username}' AND JSON_SEARCH(labels, 'one', '${newLabel}') IS NULL;
    `

    DBconnect.query(query, (err, result) => {
        if (err) {
            console.error('Error adding label:', error);
            res.status(500).send('Error adding label');
        }

        if (result.affectedRows === 0) {
            // if the label exists, do nothing
            res.status(400).send('Label already exists');
        } else {
            res.status(200).send('Label added successfully');
        }
    });

}


const deleteLabels = async function (req, res) {
    const { username, label } = req.body;

    const query = `
    UPDATE users
    SET labels = JSON_REMOVE(labels, JSON_UNQUOTE(JSON_SEARCH(labels, 'one', '${label}')))
    WHERE name = '${username}' AND JSON_SEARCH(labels, 'one', '${label}') IS NOT NULL;
  `
    DBconnect.query(query, (err, result) => {
        // if there is an error
        if (err) {
            console.error('Error deleting label:', error);
            res.status(500).send('Error deleting label');
        }

        if (result.changedRows === 0) {
            res.status(400).send('Label does not exist');
        } else {
            res.status(200).send('Label deleted successfully');
        }
    });
}


const updateLabels = async function (req, res) {
    const { username, oldLabel, newLabel } = req.body;
    const queryForCheckingLabel = `
    SELECT * FROM users WHERE name = '${username}' AND  labels like '%${newLabel}%';
    `

    const queryForUpdatingLabel = `
    UPDATE users
    SET labels = JSON_UNQUOTE(JSON_REPLACE(labels, JSON_UNQUOTE(JSON_SEARCH(labels, 'one', '${oldLabel}')), '${newLabel}'))
    WHERE name = '${username}' AND JSON_SEARCH(labels, 'one', '${oldLabel}') IS NOT NULL;
    `

    // check new Label
    DBconnect.query(queryForCheckingLabel, (err, checkNewLabel) => {
        if (err) {
            console.error('Error checking label:', err);
            res.status(500).send('Error checking label');
        }

        if (checkNewLabel.length != 0) {
            // corner case: if the newLabel exists, do nothing
            res.status(400).send('Label already exists');
        } else {
            // if the label doesn't exist, update it.
            DBconnect.query(queryForUpdatingLabel, (err, result) => {
                if (err) {
                    console.error('Error updating label:', error);
                    res.status(500).send('Error updating label');
                }
                if (result.changedRows === 0) {
                    res.status(400).send('Label does not exist');
                } else {
                    res.status(200).send('Label updated successfully');
                }
            })
        }
    });
};

const getLabels = async function (req, res) {
    const {
        username = ""
    } = req.query;


    const query = `
        SELECT labels
        FROM users
        WHERE name = '${username}';
    `

    DBconnect.query(query, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json({ data });
        }
    });
}


module.exports = {
    testAuthor,
    checkPassword,
    addLabels,
    deleteLabels,
    getLabels,
    updateLabels
}