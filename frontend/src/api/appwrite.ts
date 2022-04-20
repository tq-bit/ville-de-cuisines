import { Appwrite } from 'appwrite';

const client = new Appwrite();

client.setEndpoint('http://localhost/v1').setProject('625ea6425efdf4cc9a46');

export default client;
