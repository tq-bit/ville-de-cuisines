import { Appwrite } from 'appwrite';

const client = new Appwrite();

client
  .setEndpoint('https://kitchen.q-bit.me/v1')
  .setProject('625ea6425efdf4cc9a46');

export default client;
