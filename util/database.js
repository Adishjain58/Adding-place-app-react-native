import * as SQLite from "expo-sqlite";
import { Place } from "../models/places";

// to create a database in the local database of device
const database = SQLite.openDatabase("places.db");

// function to initialize our db and create the table that we need
export const init = () => {
  const promise = new Promise((resolve, reject) => {
    // method provided by SQLite package to execute database queries
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            imageUri TEXT NOT NULL,
            address TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
};

// function to store a new place in the db
export const insertPlace = (place) => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // this method expects 4 arguments, first is the query which should be executed, second is the
      // array of values that should be passed in the query, third is a function which gets executed if
      // the query was successfull and last one is a function which will get executed if the query was failed
      tx.executeSql(
        `INSERT INTO places (title,imageUri,address,lat,lng) VALUES(?,?,?,?,?)`,
        [
          place.title,
          place.imageUri,
          place.address,
          place.location.lat,
          place.location.lng,
        ],
        // first argument is transaction itself but here we didn't need it so that's why passed _
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
};

// function to get the data of all places from the db.
export const fetchPlaces = () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM places`,
        [],
        (_, result) => {
          const places = [];
          for (const dp of result.rows._array) {
            places.push(
              new Place(
                dp.title,
                dp.imageUri,
                {
                  address: dp.address,
                  lat: dp.lat,
                  lng: dp.lng,
                },
                dp.id
              )
            );
          }
          resolve(places);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
};

// function to retrieve a single place from the database
export const fetchPlaceById = (id) => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM places WHERE id = ?`,
        [id],
        (_, result) => {
          const dbPlace = result.rows._array[0];
          const place = new Place(
            dbPlace.title,
            dbPlace.imageUri,
            { lat: dbPlace.lat, lng: dbPlace.lng, address: dbPlace.address },
            dbPlace.id
          );
          resolve(place);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};
