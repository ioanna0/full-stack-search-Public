import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { MongoClient } from "mongodb";
import { City, Country, Hotel } from "types";

dotenv.config();

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  await import('./db/startAndSeedMemoryDB');
}

const PORT = process.env.PORT || 3001;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors())
app.use(express.json());

app.get('/hotels', async (req, res) => {
  const mongoClient = new MongoClient(DATABASE_URL);
  console.log('Connecting to MongoDB...');

  try {
    await mongoClient.connect();
    console.log('Successfully connected to MongoDB!');
    const db = mongoClient.db()
    const collection = db.collection('hotels');
    res.send(await collection.find().toArray())
  } finally {
    await mongoClient.close();
  }
})

app.get('/autocomplete', async (req, res) => {
  const mongoClient = new MongoClient(DATABASE_URL);
  console.log('Connecting to MongoDB...');
  if (!req.query.q) {
    res.send([]);
    return;
  }
  try {
    await mongoClient.connect();
    console.log('Successfully connected to MongoDB!');
    const db = mongoClient.db()
    const hotelsCollection = db.collection('hotels');
    const hotels: Hotel[] = await hotelsCollection.find().toArray();
    const citiesCollection = db.collection('cities');
    const cities: City[] = await citiesCollection.find().toArray();
    const countriesCollection = db.collection('countries');
    const countries: Country[] = await countriesCollection.find().toArray();
    const q = (req.query.q as string).toLowerCase();
    const results = [
      ...hotels.filter(hotel => hotel.hotel_name.toLowerCase().includes(q)).map(hotel => ({ type: 'hotel', name: hotel.hotel_name })),
      ...cities.filter(city => city.name.toLowerCase().includes(q)).map(city => ({ type: 'city', name: city.name })),
      ...countries.filter(country => country.country.toLowerCase().includes(q)).map(country => ({ type: 'country', name: country.country })),
    ];
    res.send(results);
  } finally {
    await mongoClient.close();
  }
})

app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`)
})
