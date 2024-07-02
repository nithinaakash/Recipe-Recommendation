// pages/api/getRecipeImages.js

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const search_term = req.query.search;
         // Assuming the search term is passed as a query parameter
        if (!search_term) {
            return res.status(400).json({ message: 'Search term is required' });
        }

        try {
            const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(search_term)}&client_id=${encodeURIComponent(process.env.unsplash_client_id)}&per_page=10`;
            const response = await fetch(unsplashUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic Og==`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                const images = data.results.map(img => ({
                    small: img.urls.small,
                    thumb: img.urls.thumb,
                    full: img.urls.full
                }));
                res.status(200).json(images);
            } else {
                console.error('Failed to fetch images:', data);
                res.status(response.status).json({ message: 'Failed to fetch images from Unsplash', details: data });
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            res.status(500).json({ message: 'Error fetching images. Please try again.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}