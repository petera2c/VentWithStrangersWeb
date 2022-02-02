import { getAuth } from "firebase/auth";

export const handleVerifyEmail = (
  navigate,
  oobCode,
  setErrorMessage,
  setVerifiedSuccess
) => {
  getAuth()
    .applyActionCode(oobCode)
    .then((resp) => {
      setVerifiedSuccess(true);
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage(error.message);
    });
};
