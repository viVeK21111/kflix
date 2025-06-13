import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { userAuthStore } from '../store/authUser';

const CallbackPage = () => {
  const { user, isAuthenticated } = useAuth0();
  const { auth0SignIn } = userAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      auth0SignIn({
        email: user.email,
        name: user.name,
        picture: user.picture,
        sub: user.sub
      });
      navigate('/');
    }
  }, [isAuthenticated, user]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
};

export default CallbackPage; 