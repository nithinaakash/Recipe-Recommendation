// path: /api/getRecipes

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await fetch(`${process.env.backend_url}recipe_recommendation/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}`,
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
            console.error('Get Recipes error:', error);
            res.status(500).json({ message: 'Get Recipes failed. Please try again.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}