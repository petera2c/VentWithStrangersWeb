export const handleVerifyEmail = (
  auth,
  oobCode,
  setErrorMessage,
  setVerifiedSuccess
) => {
  auth
    .applyActionCode(oobCode)
    .then(resp => {
      console.log(resp);
      setVerifiedSuccess(true);
    })
    .catch(error => {
      console.log(error);
      setErrorMessage(error.message);
    });
};
