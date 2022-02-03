import React, { useEffect, useState } from "react";

import LoginModal from "../Login";
import SignUpModal from "../SignUp";
import ForgotPasswordModal from "../ForgotPassword";

function Header({ activeModal = "", setActiveModal }) {
  const [localActiveModal, setLocalActiveModal] = useState(activeModal);

  useEffect(() => {
    setLocalActiveModal(activeModal);
  }, [activeModal]);

  return (
    <div style={{ zIndex: 10 }}>
      {(localActiveModal === "login" || localActiveModal === true) && (
        <LoginModal
          setActiveModal={setActiveModal ? setActiveModal : setLocalActiveModal}
        />
      )}
      {localActiveModal === "signUp" && (
        <SignUpModal
          setActiveModal={setActiveModal ? setActiveModal : setLocalActiveModal}
        />
      )}
      {localActiveModal === "forgotPassword" && (
        <ForgotPasswordModal
          setActiveModal={setActiveModal ? setActiveModal : setLocalActiveModal}
        />
      )}
    </div>
  );
}

export default Header;
