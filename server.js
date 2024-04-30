// Import required modules
const http = require('http');
const fs = require('fs');

// Simulated car control functions
function drive() {
    console.log("Car is driving forward.");
}

function stop() {
    console.log("Car has stopped.");
}

function reverse() {
    console.log("Car is reversing.");
}

function horn() {
    console.log("Honk! Honk!");
}

function read_sensor() {
    return "obstacle"; // Simulating an obstacle detected by sensor
}

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

        // Split the line into tokens
        const tokens = line.split(/\s+/);

        // Interpret tokens
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            switch (token) {
                case 'drive':
                    drive();
                    break;
                case 'stop':
                    stop();
                    break;
                case 'reverse':
                    reverse();
                    break;
                case 'horn':
                    horn();
                    break;
                case 'read_sensor':
                    const obstacle = read_sensor();
                    console.log(`Sensor reads: ${obstacle}`);
                    break;
                case 'print':
                    // Print statement
                    const message = line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'));
                    console.log(message);
                    break;
                case 'if':
                    // Handle if statements
                    const condition = tokens.slice(i + 1).join(' ');
                    const ifBlockStart = code.indexOf('{', i);
                    const ifBlockEnd = code.indexOf('}', ifBlockStart);
                    const ifBlock = code.substring(ifBlockStart + 1, ifBlockEnd);
                    if (eval(condition)) {
                        interpretCarScript(ifBlock);
                    }
                    i = ifBlockEnd;
                    break;
                case 'else':
                    // Handle else clauses
                    const elseBlockStart = code.indexOf('{', i);
                    const elseBlockEnd = code.indexOf('}', elseBlockStart);
                    const elseBlock = code.substring(elseBlockStart + 1, elseBlockEnd);
                    interpretCarScript(elseBlock);
                    i = elseBlockEnd;
                    break;
                case 'while':
                    // Handle while loops
                    const loopCondition = tokens.slice(i + 1).join(' ');
                    const whileBlockStart = code.indexOf('{', i);
                    const whileBlockEnd = code.indexOf('}', whileBlockStart);
                    const whileBlock = code.substring(whileBlockStart + 1, whileBlockEnd);
                    let iterations = 0;
                    while (eval(loopCondition)) {
                        iterations++;
                        if (iterations > 1000) {
                            console.log(`Error: Potential infinite loop detected at line ${lineNumber}`);
                            break;
                        }
                        interpretCarScript(whileBlock);
                    }
                    i = whileBlockEnd;
                    break;
                default:
                    console.log(`Error: Unknown token '${token}' at line ${lineNumber}`);
            }
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
        let carScriptCode = '';

        req.on('data', chunk => {
            carScriptCode += chunk.toString(); // Convert buffer to string
        });

        req.on('end', () => {
            // Execute CarScript code
            interpretCarScript(carScriptCode);
            res.writeHead(200);
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