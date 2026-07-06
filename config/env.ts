import dotenv from 'dotenv';

dotenv.config();

const rawBaseUrl = process.env.BASE_URL || 'https://jsonplaceholder.typicode.com';
const normalizedBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

export const env = {
  baseUrl: normalizedBaseUrl,
  apiToken: process.env.API_TOKEN || ''
};
