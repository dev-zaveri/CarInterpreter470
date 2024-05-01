// Import required modules
const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');

// Function to interpret CarScript code
function interpretCarScript(code) {
    // Split the code into lines
    const lines = code.split('\n');

    // Track current line number for error reporting
    let lineNumber = 0;

    // Iterate over each line
    for (let line of lines) {
        lineNumber++;

        // Remove leading and trailing whitespace
        line = line.trim();

        // Skip empty lines
        if (line === '') continue;

        // Check if it's the end of code input
        if (line === 'END') break;

        // Interpret CarScript commands
        switch (line) {
            case 'drive':
                console.log("Car is driving forward.");
                break;
            case 'stop':
                console.log("Car has stopped.");
                break;
            case 'reverse':
                console.log("Car is reversing.");
                break;
            case 'horn':
                console.log("Honk! Honk!");
                break;
            case 'read_sensor':
                console.log("Sensor reads: obstacle");
                break;
            default:
                console.log(`Error: Unknown CarScript command at line ${lineNumber}`);
        }
    }
}

// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Read and serve the HTML file
        fs.readFile('car_interpreter.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end(err);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.url === '/interpret' && req.method === 'POST') {
        // Interpret CarScript code from request body
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Convert buffer to string
        });

        req.on('end', () => {
            const { code } = JSON.parse(body);

            // Execute CarScript code
            interpretCarScript(code);

            // Send response
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('CarScript code executed successfully.');
        });
    } else {
        // Handle other routes
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    const link = `http://localhost:${PORT}`;
    console.log(`Server running at ${link}`);
});
