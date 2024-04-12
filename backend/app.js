const transformToXml = require('./converter');
const parseEdiText = require('./converter');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

// Use bodyParser to handle JSON and text data
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/plain' }));

// Use CORS middleware to enable Cross-Origin Resource Sharing
app.use(cors());
// Route to convert EDI text to XML
app.post('/convert', (req, res) => {
    const ediText = req.body;
    console.log(ediText);
    if (!ediText || typeof ediText !== 'string') {
        return res.status(400).json({ error: 'Invalid EDI text' });
    }

    try {
        // Parse the EDI text
        const parsedData = parseEdiText(ediText);

        // Transform parsed data to XML format
        const xml = transformToXml(parsedData);

        // Send the XML response
        res.type('application/xml').send(xml);
    } catch (error) {
        // Handle any errors during the conversion process
        console.error('Error during conversion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server on port 3000
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});