import { useState, useEffect } from 'react';
import { account } from '../app/appwrite';

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { currentUser, loading, error };
};

export default useCurrentUser;
