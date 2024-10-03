"use client";
import { useEffect, useState } from "react";
import { account, AppwriteException } from "./appwrite";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import getCurrentUser from "../hook/getCurrentUser";

const LoginPage = () => {
  const router = useRouter();
  const { currentUser } = getCurrentUser();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await account.createEmailPasswordSession(email, password);
      toast.success('Login successful');
      router.push('/dashboard');
      setLoading(false);
  } catch (err: any) {
      if (err instanceof AppwriteException) {
        toast.error(err.message);
        setLoading(false);
      } else {
        toast.error(err.message);
        setLoading(false);
      }
  }
  };


  return (
    <>
      <div className="screen_container">
	      <div className="screen flex flex-col">
          <div className="logo-container">
            <Image alt="logo image" className="logo" width={370} height={380} src="/Logo.webp" />
          </div>
	    	  <div className="screen__content">
	    	  	<form className="login">
	    	  		<div className="login__field">
	    	  			<i className="login__icon fas fa-user"></i>
	    	  			<input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className="login__input col-sm-6" placeholder="Email" />
	    	  		</div>
	    	  		<div className="login__field">
	    	  			<i className="login__icon fas fa-lock"></i>
	    	  			<input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} className="login__input col-sm-6 login_pass" placeholder="Password" />
                <span onClick={() => setShowPassword(prev => !prev)} className='text-sm'>{showPassword ? 'Hide' : 'Show'}</span>
	    	  		</div>
	    	  		<button type="button" onClick={() => login(email, password)} className="button login__submit">
                {loading ? 'Loading...' : 'Log in'}
	    	  		</button>	
	    	  	</form>
	    	  </div>
	    	  <div className="screen__background">
	    	  	<span className="screen__background__shape screen__background__shape4"></span>
	    	  	<span className="screen__background__shape screen__background__shape3"></span>		
	    	  	<span className="screen__background__shape screen__background__shape2"></span>
	    	  	<span className="screen__background__shape screen__background__shape1"></span>
	    	  </div>		
	      </div>
      </div>
    </>
  );
};

export default LoginPage;
