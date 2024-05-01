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

// Function to interpret Car Interpreter code
function interpretCarScript(code) {
    // Split the code into lines
    const lines = code.split('\n');

    // Track current line number for error reporting
    let lineNumber = 0;

    // Define a variable to store the result of arithmetic operations
    let result;

    // Iterate over each line
    for (let line of lines) {
        lineNumber++;

        // Remove leading and trailing whitespace
        line = line.trim();

        // Skip empty lines
        if (line === '') continue;

        // Check if it's the end of code input
        if (line === 'END') break;

        // Interpret tokens
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            switch (token) {
                case 'drive();':
                    drive();
                    break;
                case 'stop();':
                    stop();
                    break;
                case 'reverse();':
                    reverse();
                    break;
                case 'horn();':
                    horn();
                    break;
                case 'read_sensor();':
                    const obstacle = read_sensor();
                    console.log(`Sensor reads: ${obstacle}`);
                    break;
                default:
                    // Check for arithmetic operations
                    if (/^\w+\s*([+\-*\/])\s*\w+$/.test(token)) {
                        // Split the operation into its components
                        const components = token.split(/\s*([+\-*\/])\s*/);
                        const operator = components[1];

                        // Perform the arithmetic operation and store the result
                        switch (operator) {
                            case '+':
                                result = parseFloat(components[0]) + parseFloat(components[2]);
                                break;
                            case '-':
                                result = parseFloat(components[0]) - parseFloat(components[2]);
                                break;
                            case '*':
                                result = parseFloat(components[0]) * parseFloat(components[2]);
                                break;
                            case '/':
                                result = parseFloat(components[0]) / parseFloat(components[2]);
                                break;
                        }

                        // Output the result
                        console.log(`Car is accelerating at ${result} mph.`);
                    }
                    // Unknown token
                    else {
                        console.log(`Error: Unknown token '${token}' at line ${lineNumber}`);
                    }
            }
        }
    }
}
