import { getAuth } from "firebase/auth";

export const login = ({ email, password }, setActiveModal) => {
  getAuth()
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      setActiveModal();
      window.location.reload();
    })
    .catch((error) => {
      alert(error);
    });
};
