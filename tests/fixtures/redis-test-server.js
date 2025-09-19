
        const RedisMemoryServer = require('redis-memory-server').default;
        
        const redisServer = new RedisMemoryServer({
          instance: {
            port: 6379
          }
        });
        
        module.exports = redisServer;
      