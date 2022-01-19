export const handleVerifyEmail = (
  auth,
  navigate,
  oobCode,
  setErrorMessage,
  setVerifiedSuccess
) => {
  auth
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
