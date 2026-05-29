exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const PAWAPAY_API_TOKEN = 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIxNTQzIiwibWF2IjoiMSIsImV4cCI6MjA5NTY2MTQ5NywiaWF0IjoxNzgwMDQyMjk3LCJwbSI6IkRBRixQQUYiLCJqdGkiOiI0NmU0YWE5NC0wODQyLTQ4NTMtOGFlMi0zNTlkM2MyNmE3YjgifQ.qFZR7UHomA4XLuFQBZ-oepnIU45E85lLzB7ibOyvBA0E9YypGbGFVh1M1l2MnUUB9APHIzF29dkn18wEryHizQ';
  const PAWAPAY_ENDPOINT  = 'https://api.sandbox.pawapay.io/v1/widget/sessions';

  try {
    const body = JSON.parse(event.body);

    // Fix statementDescription: alphanumeric only, 4–22 chars
    body.statementDescription = body.statementDescription
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 22)
      .padEnd(4, 'X');

    const response = await fetch(PAWAPAY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + PAWAPAY_API_TOKEN,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Return full response including any PawaPay error details
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
