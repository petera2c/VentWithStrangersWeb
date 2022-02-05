import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const db = getFirestore();
const db2 = getDatabase();

//window.location.hostname !== "localhost"
if (false) {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectDatabaseEmulator(db2, "localhost", 9000);
  const auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { db, db2 };
