import { createClient } from 'redis';
import envVars from './env';

const client = createClient({
    username: envVars.REDIS.REDIS_USERNAME,
    password: envVars.REDIS.REDIS_PASSWORD,
    socket: {
        host: envVars.REDIS.REDIS_HOST,
        port: envVars.REDIS.REDIS_PORT
    }
});

client.on('error', err => console.log('Redis Client Error', err));


// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar


export const connectRedis = async() =>{
    if(!client.isOpen){
        await client.connect();
        console.log('Connected to Redis');
    }
}