
        const { MongoMemoryServer } = require('mongodb-memory-server');
        
        const mongoServer = new MongoMemoryServer({
          instance: {
            dbName: 'ubuntu_health_test',
            port: 27017
          }
        });
        
        module.exports = mongoServer;
      