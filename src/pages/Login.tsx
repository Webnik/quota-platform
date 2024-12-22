import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginWrapper from "@/components/auth/LoginWrapper";
import { MFAVerification } from "@/components/auth/MFAVerification";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showMFA, setShowMFA] = useState(false);
  const navigate = useNavigate();

  const handleMFARequired = () => {
    setShowMFA(true);
  };

  const handleMFAVerified = () => {
    navigate("/dashboard");
  };

  return (
    <LoginWrapper>
      <LoginHeader />
      {showMFA ? (
        <MFAVerification onVerified={handleMFAVerified} />
      ) : (
        <LoginForm onMFARequired={handleMFARequired} />
      )}
    </LoginWrapper>
  );
};

export default Login;