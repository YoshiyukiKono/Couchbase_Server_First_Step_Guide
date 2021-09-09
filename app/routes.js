var path = require('path');
var couchbase = require('couchbase');

const cluster = new couchbase.Cluster('couchbase://localhost', {
    username: 'user_management_app',
    password: 'C0uchb@se',
})

const bucket = cluster.bucket('user_management');
const collection = bucket.scope('japan').collection('users')

const qs = 'SELECT id, name from user_management.japan.users'; 

const upsertDocument = async (doc) => {
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
  const result = await cluster.query(qs, {
    scanConsistency: couchbase.QueryScanConsistency.RequestPlus,
  });
  return result.rows;
}

var routes = function(app) {
    app.get('/users', async (req, res) => {      
        const rows = await selectUsers();
        res.json(rows);
      });
    app.post('/user', function(req, res) {
      const user = {
        id: req.body.id,
        name: req.body.name,
      };
      upsertDocument(user);
      res.json({});
    });
    app.delete("/user/:id", function(req, res) {
      removeUser(req.query.id);
      res.json({});
  });
};
module.exports = routes;