import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-background flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to Quota</h1>
            <p className="text-muted text-sm uppercase tracking-wider">BY CANOPY</p>
          </div>
          <LoginForm />
        </div>
      </div>
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/lovable-uploads/11e9ef38-ad3f-439c-a205-3ddf1ee96f5e.png')"
        }}
      />
    </div>
  );
};

export default Login;