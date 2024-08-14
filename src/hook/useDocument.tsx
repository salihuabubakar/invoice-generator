import { useState, useEffect } from 'react';
import { databases, AppwriteException } from '../app/appwrite'; // Ensure the correct path to your Appwrite setup


const useDocuments = (databaseId: string, collectionId: string, queries = []) => {
  const [documents, setDocuments] = useState<any[]>([]); // Changed to an array to store multiple documents
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { documents } = await databases.listDocuments(databaseId, collectionId, queries);
        setDocuments(documents); // Updated to handle the array of documents
      } catch (err: any) {
        if (err instanceof AppwriteException) {
          setError(`AppwriteException: ${err.message}`);
        } else {
          setError(`Unexpected Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [databaseId, collectionId, queries]);

  return { documents, loading, error }; // Updated to return an array of documents
};

export default useDocuments;
