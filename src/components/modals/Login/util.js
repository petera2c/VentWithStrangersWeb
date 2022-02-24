import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const login = ({ email, password }, setActiveModal) => {
  signInWithEmailAndPassword(getAuth(), email.replace(/ /g, ""), password)
    .then(() => {
      setActiveModal();
    })
    .catch((error) => {
      alert(error);
    });
};
