const { useEffect, useState } = require("react");
import { useAuth } from '@/context/Authcontext';

const VerifyAccount = () => {
    const { verifyAccount } = useAuth();
    const [code, setCode] = useState(null);
    const [email, setEmail] = useState(null);
    useEffect(() => {
        // Verify account
        //get code and email from url
        const Code = new URLSearchParams(window.location.search).get('code');
        setCode(new URLSearchParams(window.location.search).get('code'));
        const Email = new URLSearchParams(window.location.search).get('email');
        setEmail(new URLSearchParams(window.location.search).get('email'));
        //call verify account function
        console.log(Code, Email);
        if (Code && Email)
        verifyAccount(Email, Code);
    }, []);
  return (
    <div className="flex justify-center items-center h-screen">
      {(code && email) ? <h1 className="text-center text-4xl font-bold">Pls Hold Account is being Verified...</h1> : <h1 className="text-center text-4xl font-bold">Pls Check your email for verification link, it will expire in 5 minutes.</h1>}
    </div>
  );
}

export default VerifyAccount;