import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const db = getFirestore();
connectFirestoreEmulator(db, "localhost", 8080);

const db2 = getDatabase();
//connectDatabaseEmulator(db, "localhost", 9000);

const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");

export { db, db2 };
