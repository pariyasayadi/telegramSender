const net = require('net');

// Function to decode the received telegram message
function decodeTelegramMessage(data) {
    // Extract the components from the received data Buffer
    const identifier = data.slice(0, 3).toString('ascii');
    const distance = data.readBigInt64BE(3); // Read a 64-bit big-endian integer
    const magnitude = data.readUInt32BE(11); // Read a 32-bit unsigned big-endian integer
    const phase = data.readInt8(15); // Read an 8-bit signed integer
    const temperature = data.readInt32LE(16); // Read a 32-bit little-endian integer

    // Construct and return an object containing the decoded components
    const decodedMessage = {
        identifier: identifier,
        distance: Number(distance),
        magnitude: magnitude,
        phase: phase,
        temperature: temperature
    };

    return decodedMessage;
}
// Create a TCP server to receive the message
const server = net.createServer((socket) => {

    console.log('Client connected.');

    // Listen for data from the client
    socket.on('data', (data) => {
        console.log('Received data:', data);
        // Here you can process the received data as needed
        const decodedMessage = decodeTelegramMessage(data);
        console.log('Decoded message:', decodedMessage);
    });

    // Handle client disconnection
    socket.on('end', () => {
        console.log('Client disconnected.');
    });

    // Handle errors
    socket.on('error', (err) => {
        console.error('Error:', err);
    });
});

// Listen for incoming connections
const port = 3001;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

