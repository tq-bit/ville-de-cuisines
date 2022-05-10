import { Appwrite } from 'appwrite';

const client = new Appwrite();

const PROD_URL = 'https://kitchen.q-bit.me/v1'
const DEV_URL = 'http://localhost/v1'

client
  .setEndpoint(import.meta.env.DEV ? DEV_URL : PROD_URL)
  .setProject('625ea6425efdf4cc9a46');

export default client;
