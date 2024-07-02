

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { user_input } = req.body;
        
        try {
            const response = await fetch(`${process.env.backend_url}recipe_recommendation/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}`,
                },
                body: JSON.stringify({ user_input }),
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
            console.error('Search Recipe List error:', error);
            res.status(500).json({ message: 'Search Recipe List failed. Please try again.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}