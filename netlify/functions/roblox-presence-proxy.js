exports.handler = async (event, context) => {
    // Ensure only POST requests are allowed
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    try {
        // Parse the JSON body from the incoming request (from Roblox HttpService)
        // Netlify Functions put the body in event.body
        const { userIds } = JSON.parse(event.body);

        // Validate that userIds is an array and not empty
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'userIds array is required and must not be empty' }),
                headers: { 'Content-Type': 'application/json' },
            };
        }

        const robloxApiUrl = 'https://presence.roblox.com/v1/presence/users';

        // Make the POST request to the actual Roblox API
        // Netlify Functions (running on Node.js 18+) have 'fetch' globally available
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
        return {
            statusCode: robloxResponse.status, // Pass through Roblox's HTTP status code
            body: JSON.stringify(data),        // Pass through Roblox's response body
            headers: { 'Content-Type': 'application/json' },
        };

    } catch (error) {
        console.error('Proxy function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
            headers: { 'Content-Type': 'application/json' },
        };
    }
};