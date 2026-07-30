const axios = require('axios');

const LANGUAGE_ID_MAP = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
};

const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || 'https://ce.judge0.com';

const createClient = () => {
  const headers = {};

  if (process.env.JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
  }

  if (process.env.JUDGE0_API_HOST) {
    headers['X-RapidAPI-Host'] = process.env.JUDGE0_API_HOST;
  }

  return axios.create({
    baseURL: JUDGE0_BASE_URL,
    headers,
    timeout: 15000,
  });
};

const judge0Client = createClient();

const runCode = async ({ sourceCode, language, stdin }) => {
  const languageId = LANGUAGE_ID_MAP[language];

  if (!languageId) {
    throw new Error('Unsupported language');
  }

  const { data } = await judge0Client.post('/submissions?base64_encoded=false&wait=true', {
    language_id: languageId,
    source_code: sourceCode,
    stdin,
  });

  return data;
};

module.exports = {
  LANGUAGE_ID_MAP,
  runCode,
};
