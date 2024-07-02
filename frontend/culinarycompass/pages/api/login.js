// pages/api/login.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      const response = await fetch(`${process.env.backend_url}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        // if data contains key 'non_field_errors' then it is a login error, so print the error message
        if (data.non_field_errors) {
          res.status(response.status).json(data.non_field_errors[0]);
        } else {
          res.status(400).json(data);
        }
        res.status(response.status).json(data);
      }
      else {
        res.status(200).json(data);
      }

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}


