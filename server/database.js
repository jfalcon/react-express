import mongoose from 'mongoose';        // MongoDB object modeling for Node
import { config } from 'package.json';  // configuration info

export default (shouldConnect, callback) => {
  // wrapping this functionality allows us to connect
  // or not connect to a backend database as needed
  if (shouldConnect) {
    mongoose.Promise = global.Promise;
    const database = mongoose.connect(config.database);

    mongoose.connection.on('connected', () => {
      if (typeof callback !== 'undefined') callback(database);
    });

    mongoose.connection.on('error', () => {
      if (typeof callback !== 'undefined') callback();
    });
  }
  else if (typeof callback !== 'undefined') callback();
};
