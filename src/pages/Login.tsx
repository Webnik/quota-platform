import LoginWrapper from "@/components/auth/LoginWrapper";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-background flex flex-col justify-center items-center p-8 md:p-12 lg:p-16">
        <LoginWrapper />
      </div>
      
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')",
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background/40 backdrop-blur-sm" />
      </div>
    </div>
  );
};

export default Login;