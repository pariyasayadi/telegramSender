const net = require('net');

// Function to construct the telegram message
function constructTelegramMessage() {
    const identifier = "MCR";
    const distance = BigInt(2345); // Distance in millimeters
    const magnitude = 125; // Magnitude (unsigned 32-bit integer)
    const phase = 3; // Phase (signed 8-bit integer)
    const temperature = 33; // Temperature in Celsius (signed 32-bit integer)

    // Convert each component to the required byte format
    const identifierBytes = Buffer.from(identifier, 'ascii');
    const distanceBytes = Buffer.alloc(8);
    distanceBytes.writeBigInt64BE(distance);
    const magnitudeBytes = Buffer.alloc(4);
    magnitudeBytes.writeUInt32BE(magnitude);
    const phaseByte = Buffer.alloc(1);
    phaseByte.writeInt8(phase);
    const temperatureBytes = Buffer.alloc(4);
    temperatureBytes.writeInt32LE(temperature);

    // Concatenate all components to form the complete telegram message
    const telegramMessage = Buffer.concat([identifierBytes, distanceBytes, magnitudeBytes, phaseByte, temperatureBytes]);
    
    return telegramMessage;
}

// Function to send the telegram message over TCP/IP
function sendTelegramMessage(telegramMessage) {
    const client = net.createConnection({ host: '192.168.178.140', port: 12345 }, () => {
        console.log('Connected to server!');
        client.write(telegramMessage); // Send the telegram message
        client.end(); // Close the connection
    });

    client.on('error', (err) => {
        console.error('Error:', err);
    });
}

// Call the functions to construct and send the telegram message
const telegramMessage = constructTelegramMessage();
sendTelegramMessage(telegramMessage);
