import fs from 'fs';
import path from 'path';
import os from 'os';
import { createRequire } from 'module';
import admin from 'firebase-admin';

// Create a 'require' function for importing JSON in ESM
const require = createRequire(import.meta.url);

// 1. SETUP - Point this to your downloaded JSON key
const SERVICE_ACCOUNT_PATH = './service-account.json'; 
const TARGET_USER_ID = '6b8r6JPyMEZbO9pz1WpN5puUuMn2';

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('Error: service-account.json not found.');
  process.exit(1);
}

// Import the JSON key
const serviceAccount = require(path.resolve(SERVICE_ACCOUNT_PATH));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 2. TYPES
interface LocalState {
  [date: string]: {
    bikeMins: number;
    mSquats: boolean;
    nSquats: boolean;
    lifts: Record<string, { name: string; s1: string; s2: string }>;
  };
}

// 3. PARSER
const STATE_FILE = path.join(os.homedir(), '.gatekeeper_state');
console.log(`Reading from: ${STATE_FILE}`);

if (!fs.existsSync(STATE_FILE)) {
  console.log('State file not found.');
  process.exit(0);
}

const rawData = fs.readFileSync(STATE_FILE, 'utf-8');
const lines = rawData.split('\n').filter((l) => l.trim() !== '');

const dataByDate: LocalState = {};

lines.forEach((line) => {
  // Format: YYYY-MM-DD_KEY=VALUE
  const match = line.match(/^(\d{4}-\d{2}-\d{2})_(.+)=(.+)$/);
  if (!match) return;

  const [, date, key, value] = match;

  if (!dataByDate[date]) {
    dataByDate[date] = { bikeMins: 0, mSquats: false, nSquats: false, lifts: {} };
  }

  // --- THE LINE THAT WAS BROKEN IS FIXED BELOW ---
  if (key === 'BIKE_MINS') dataByDate[date].bikeMins = parseInt(value, 10);
  if (key === 'M_SQUATS') dataByDate[date].mSquats = value === '1';
  if (key === 'N_SQUATS') dataByDate[date].nSquats = value === '1';

  // Parse Lifts: LIFT_1_NAME, LIFT_1_S1
  if (key.startsWith('LIFT_')) {
    const parts = key.split('_'); // ["LIFT", "1", "NAME"]
    const index = parts[1];
    const field = parts[2]; // NAME, S1, or S2

    if (!dataByDate[date].lifts[index]) {
      dataByDate[date].lifts[index] = { name: '', s1: '0', s2: '0' };
    }

    if (field === 'NAME') dataByDate[date].lifts[index].name = value;
    if (field === 'S1') dataByDate[date].lifts[index].s1 = value;
    if (field === 'S2') dataByDate[date].lifts[index].s2 = value;
  }
});

// 4. UPLOADER
const sync = async () => {
  const batch = db.batch();
  let count = 0;

  for (const [date, data] of Object.entries(dataByDate)) {
    // A. Sync Bike (as ActivityEntry)
    if (data.bikeMins > 0) {
      const docId = `sync_bike_${date}`;
      const docRef = db.collection('entries').doc(docId);
      batch.set(docRef, {
        type: 'activity',
        activityType: 'Cycling',
        duration: data.bikeMins,
        date: date, 
        loggedBy: TARGET_USER_ID,
        createdAt: new Date().toISOString(),
        notes: 'Synced from Gatekeeper',
      }, { merge: true });
      count++;
    }

    // B. Sync Lifts (as WorkoutEntry)
    const liftKeys = Object.keys(data.lifts);
    if (liftKeys.length > 0) {
      const exercises = liftKeys.map((k) => {
        const l = data.lifts[k];
        return {
          name: l.name,
          sets: 2,
          reps: `${l.s1}, ${l.s2}`,
          notes: 'Gatekeeper Log',
        };
      });

      const docId = `sync_workout_${date}`;
      const docRef = db.collection('entries').doc(docId);
      batch.set(docRef, {
        type: 'workout',
        workoutType: 'Dumbbells',
        date: date,
        loggedBy: TARGET_USER_ID,
        exercises: exercises,
        location: 'Home',
        createdAt: new Date().toISOString(),
        notes: 'Synced from Gatekeeper',
      }, { merge: true });
      count++;
    }
  }

  if (count > 0) {
    await batch.commit();
    console.log(`Successfully synced ${count} entries to Firestore.`);
  } else {
    console.log('No relevant data found to sync.');
  }
};

sync().catch(console.error);