//var path = require('path');
var couchbase = require('couchbase');

const cluster = new couchbase.Cluster('couchbase://localhost', {
    username: 'user_management_app',
    password: 'C0uchb@se',
})



const bucket = cluster.bucket('user_management');
const scope = bucket.scope('japan')
const collection = scope.collection('users')

const qs = 'SELECT id, name from users'; 


const addUser = async (doc) => {
  try {
    const key = `${doc.id}`;
    const result = await collection.upsert(key, doc);
  } catch (error) {
    console.error(error);
  }
};

const removeUser = async (id) => {
  try {
    const key = `${id}`;
    const result = await collection.remove(key);
  } catch (error) {
    console.error(error);
  }
};

const selectUsers = async (key) => {
  const result = await scope.query(qs, {
		scanConsistency: couchbase.QueryScanConsistency.RequestPlus,
	  });
  return result.rows;
}

var routes = function(app) {

    app.get('/users', async (req, res, next) => { 
		(async() => {     
            const rows = await selectUsers();
            res.json(rows);
	    })().catch(next);
    });
    app.post('/user', function(req, res, next) {
        (async() => {
			const user = {
				id: req.body.id,
				name: req.body.name,
			  };
			  addUser(user);
			  res.json({});
		})().catch(next);
    });
    app.delete("/user/:id", function(req, res, next) {
        (async() => {
			removeUser(req.query.id);
			res.json({});
		})().catch(next);
    });
};
module.exports = routes;