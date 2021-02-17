import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyCk8EfNyqarIzBAQSCFgU8634o-e0iA_Os",
  appId: "1:440569980458:web:870c6bde68871e5fd78553",
  authDomain: "vent-with-strangers-2acc6.firebaseapp.com",
  databaseURL: "https://vent-with-strangers-2acc6.firebaseio.com",
  measurementId: "G-N5NTVEZHSN",
  messagingSenderId: "440569980458",
  projectId: "vent-with-strangers-2acc6",
  storageBucket: "vent-with-strangers-2acc6.appspot.com"
};

if (location.hostname === "localhost") {
  firebaseConfig = {
    apiKey: "AIzaSyCk8EfNyqarIzBAQSCFgU8634o-e0iA_Os",
    appId: "1:440569980458:web:870c6bde68871e5fd78553",
    authDomain: "vent-with-strangers-2acc6.firebaseapp.com",
    databaseURL: "http://localhost:9000?ns=vent-with-strangers-2acc6",
    measurementId: "G-N5NTVEZHSN",
    messagingSenderId: "440569980458",
    projectId: "vent-with-strangers-2acc6",
    storageBucket: "vent-with-strangers-2acc6.appspot.com"
  };
}
const firebaseApp = firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
if (location.hostname === "localhost") db.useEmulator("localhost", 8080);

export default db;
