export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await fetch(`${process.env.backend_url}verify/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body),
            });
            const data = await response.json();
            if (response.ok && response.status === 200) {
                res.status(200).json(data);
            }
            else {
                res.status(400).json(data);
            }
        }
        catch (error) {
            console.error('Verify Account error:', error);
            res.status(500).json({ message: 'Verify Account failed. Please try again.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}