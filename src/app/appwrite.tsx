import { Client, Account, Databases } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66b5f2c40032c602f47d');

export const account = new Account(client);
export const databases = new Databases(client);


export { ID, AppwriteException } from 'appwrite';
