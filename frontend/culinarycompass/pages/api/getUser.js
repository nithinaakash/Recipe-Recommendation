// api/getUser.js

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const response = await fetch(`${process.env.backend_url}profile/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                res.status(200).json(data);
            }
            else {
                res.status(400).json(data);
            }
        }
        catch (error) {
            console.error('Get User error:', error);
            res.status(500).json({ message: 'Get User failed. Please try again.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
