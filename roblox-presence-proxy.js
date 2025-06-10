module.exports = async (req, res) => {
    // Ensure only POST requests are allowed
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        // Parse the JSON body from the incoming request (from Roblox)
        const { userIds } = req.body;

        // Validate that userIds is an array and not empty
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({ error: 'userIds array is required and must not be empty' });
            return;
        }

        const robloxApiUrl = 'https://presence.roblox.com/v1/presence/users';

        // Make the POST request to the actual Roblox API
        const robloxResponse = await fetch(robloxApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ userIds }), // Send the userIds array as JSON
        });

        // Get the JSON response from Roblox
        const data = await robloxResponse.json();

        // Return Roblox's response back to the client (your Roblox game)
        res.status(robloxResponse.status).json(data);

    } catch (error) {
        console.error('Proxy function error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};