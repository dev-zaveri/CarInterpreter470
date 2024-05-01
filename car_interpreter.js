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

        // Split the line into tokens
        const tokens = line.split(/\s+/);

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
                    // Check for arithmetic operations
                    if (/^\w+\s*=\s*\w+\s*[\+\-\*\/]\s*\w+$/.test(token)) {
                        // Split the operation into its components
                        const components = token.split(/\s*[\+\-\*\/]\s*/);
                        const operator = token.match(/\s*([\+\-\*\/])\s*/)[1];

                        // Perform the arithmetic operation and store the result
                        switch (operator) {
                            case '+':
                                result = parseFloat(components[1]) + parseFloat(components[2]);
                                break;
                            case '-':
                                result = parseFloat(components[1]) - parseFloat(components[2]);
                                break;
                            case '*':
                                result = parseFloat(components[1]) * parseFloat(components[2]);
                                break;
                            case '/':
                                result = parseFloat(components[1]) / parseFloat(components[2]);
                                break;
                        }

                        // Assign the result to the variable
                        eval(`${components[0]} = ${result}`);
                    }
                    // Check for comparison operations
                    else if (/^\w+\s*[!=<>]+\s*\w+$/.test(token)) {
                        // Evaluate the comparison expression
                        const result = eval(token);
                        console.log(`Comparison result: ${result}`);
                    }
                    // Unknown token
                    else {
                        console.log(`Error: Unknown token '${token}' at line ${lineNumber}`);
                    }
            }
        }
    }
}


// Get CarScript code from user input
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Enter your CarScript code line by line. Type 'END' on a new line when finished.");

let carScriptCode = "";

readline.on('line', (line) => {
  if (line.trim() === 'END') {
    // Execute CarScript code
    interpretCarScript(carScriptCode);
    readline.close();
  } else {
    carScriptCode += line + '\n';
  }
});
