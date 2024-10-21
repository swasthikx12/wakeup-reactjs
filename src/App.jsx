import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [bgColor, setBgColor] = useState('white');
  const [messages, setMessages] = useState([]);
  const [isMaxUser, setIsMaxUser] = useState(false);
  const [isSender, setIsSender] = useState(false);
  const [maxData, setMaxData] = useState({ firstmax: '', secondmax: '' });
  const [batteryMax, setBatteryMax] = useState(0);
  const [userId, setUserId] = useState(null); // State to hold the user ID
  const websocket = useRef(null);

  const connectWebSocket = () => {
    if (!websocket.current || websocket.current.readyState === WebSocket.CLOSED) {
      websocket.current = new WebSocket('https://wakeupradio.onrender.com');

      websocket.current.onopen = () => {
        console.log('Connected to WebSocket server');
      };

      websocket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Check if the message contains a userId
        if (data.userId) {
          setUserId(data.userId); // Set the user ID from the server
        }

        // Handle other messages
        if (data.message) {
          const { focaldepth, hypocenter, degree_of_earthquake, magnitude, focal_mechanism, node_number } = data.message;

          if (focaldepth !== undefined && hypocenter !== undefined && degree_of_earthquake !== undefined && magnitude !== undefined && focal_mechanism !== undefined && node_number) {
            console.log('Received stored object:', { focaldepth, hypocenter });
            setMessages((prevMessages) => [
              { sender: node_number, message: `Focal Depth: ${focaldepth}` },
              { sender: node_number, message: `Hypocenter: ${hypocenter.latitude} ${hypocenter.longitude}` },
              { sender: node_number, message: `Degree of Earthquake: ${degree_of_earthquake}` },
              { sender: node_number, message: `Magnitude: ${magnitude}` },
              { sender: node_number, message: `Focal Mechanism: ${focal_mechanism}` },
              ...prevMessages,
            ]);
          } else {
            // Handle other message types
            if (data.message === 'sender') {
              setBgColor('red');
              setIsSender(true); // Set isSender to true for red background
            } else if (data.message === 'send') {
              setBgColor('yellow');
              setIsSender(false); // Keep isSender false for yellow background
            } else if (data.message === 'max') {
              setIsMaxUser(true);
              if (data.maxBattery && data.secondMaxBattery) {
                setMaxData({ firstmax: data.maxBattery, secondmax: data.secondMaxBattery });
                setBatteryMax(data.maxBattery); // Initialize batteryMax
              }
            } else if (data.message === 'low') {
              setIsMaxUser(false);
            } else {
              console.log(data.message);
              setMessages((prevMessages) => [
                { sender: isSender ? 'node' : 'Sender (yellow background)', message: data.message },
                ...prevMessages,
              ]);
            }
          }
        }
      };

      websocket.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      websocket.current.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
  };

  const sendBatteryValue = () => {
    const message = JSON.stringify({ battery: 20 });
    websocket.current.send(message);
    console.log("sending 20");
  };

  const sendbig = () => {
    const message = JSON.stringify({ battery: 100 });
    websocket.current.send(message);
  };

  const easy = () => {
    // Function to get a random integer between min and max (inclusive)
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to get a random element from an array
    function getRandomElement(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function getRandomElementfromarray(arr) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }

    const coordinates = [
      { latitude: 37.7749, longitude: -122.4194 }, // Example: San Francisco
      { latitude: 51.5074, longitude: -0.1278 },   // Example: London
      { latitude: -33.8688, longitude: 151.2093 }, // Example: Sydney
      { latitude: 40.7128, longitude: -74.0060 },  // Example: New York
      { latitude: 35.6895, longitude: 139.6917 },  // Example: Tokyo
      { latitude: 48.8566, longitude: 2.3522 },    // Example: Paris
      { latitude: -23.5505, longitude: -46.6333 }, // Example: São Paulo
      { latitude: 34.0522, longitude: -118.2437 }, // Example: Los Angeles
      { latitude: 55.7558, longitude: 37.6173 },   // Example: Moscow
      { latitude: -1.2921, longitude: 36.8219 },   // Example: Nairobi
      { latitude: 19.4326, longitude: -99.1332 },  // Example: Mexico City
      { latitude: 28.6139, longitude: 77.2090 },   // Example: New Delhi
      { latitude: 52.5200, longitude: 13.4050 },   // Example: Berlin
      { latitude: -34.6037, longitude: -58.3816 }, // Example: Buenos Aires
      { latitude: 31.2304, longitude: 121.4737 },  // Example: Shanghai
      { latitude: -4.4419, longitude: 15.2663 },   // Example: Kinshasa
      { latitude: -37.8136, longitude: 144.9631 }, // Example: Melbourne
      { latitude: 41.9028, longitude: 12.4964 },   // Example: Rome
      { latitude: -29.8587, longitude: 31.0218 },  // Example: Durban
      { latitude: 60.1699, longitude: 24.9384 },   // Example: Helsinki
      { latitude: 45.4215, longitude: -75.6972 },  // Example: Ottawa
      { latitude: 35.6762, longitude: 139.6503 },  // Example: Yokohama
      { latitude: 25.2760, longitude: 55.2963 },   // Example: Dubai
      { latitude: -22.9068, longitude: -43.1729 }, // Example: Rio de Janeiro
      { latitude: 50.8503, longitude: 4.3517 },    // Example: Brussels
      { latitude: 1.3521, longitude: 103.8198 },   // Example: Singapore
      { latitude: -26.2041, longitude: 28.0473 },  // Example: Johannesburg
      { latitude: 35.2271, longitude: -80.8431 },  // Example: Charlotte
      { latitude: 37.5665, longitude: 126.9780 },  // Example: Seoul
      { latitude: 12.9716, longitude: 77.5946 },   // Example: Bengaluru
      { latitude: 43.6532, longitude: -79.3832 },  // Example: Toronto
      { latitude: 13.7563, longitude: 100.5018 },  // Example: Bangkok
      { latitude: 25.2048, longitude: 55.2708 },   // Example: Abu Dhabi
      { latitude: 54.6872, longitude: 25.2797 },   // Example: Vilnius
      { latitude: -41.2865, longitude: 174.7762 }, // Example: Wellington
      { latitude: 30.0444, longitude: 31.2357 },   // Example: Cairo
      { latitude: -12.0464, longitude: -77.0428 }, // Example: Lima
      { latitude: 39.9042, longitude: 116.4074 },  // Example: Beijing
      { latitude: 49.2827, longitude: -123.1207 }, // Example: Vancouver
      { latitude: 36.1699, longitude: -115.1398 }  // Example: Las Vegas
    ];

    const focalMechanisms = [
      "Strike-slip fault",
      "Reverse fault",
      "Normal fault",
      "Oblique-slip fault",
      "Thrust fault",
      "Detachment fault",
      "Transform fault",
      "Blind thrust fault",
      "Listric fault",
      "Rotational fault",
      "Horst and graben fault",
      "Step-over fault",
      "Conjugate fault",
      "Extensional fault",
      "Riedel shear fault",
      "Decollement fault",
      "Transpressional fault",
      "Transtensional fault",
      "Transfer fault",
      "Growth fault"
    ];

    // Example userId
    const storedObject = {
      focaldepth: getRandomInt(50, 200), // random value between 50 to 200
      hypocenter: getRandomElement(coordinates),
      degree_of_earthquake: getRandomInt(1, 10), // random value between 1 to 10
      magnitude: getRandomInt(1, 20), // random value between 1 to 20
      focal_mechanism: getRandomElementfromarray(focalMechanisms), // random output from the array
      node_number: userId
    };

    // Send the entire object
    websocket.current.send(JSON.stringify({ message: storedObject }));

    setMessages((prevMessages) => [
      { sender: userId, message: `Focal Depth: ${storedObject.focaldepth}` },
      { sender: userId, message: `Hypocenter: ${storedObject.hypocenter.latitude} ${storedObject.hypocenter.longitude}` },
      { sender: userId, message: `Degree of Earthquake: ${storedObject.degree_of_earthquake}` },
      { sender: userId, message: `Magnitude: ${storedObject.magnitude}` },
      { sender: userId, message: `Focal Mechanism: ${storedObject.focal_mechanism}` },
      ...prevMessages,
    ]);
  };

  const checkBatteryStatus = () => {
    console.log('Current batteryMax:', batteryMax);
    console.log('Current secondmax:', maxData.secondmax);
    if (batteryMax < maxData.secondmax) {
      websocket.current.send(JSON.stringify({ message: 'low' }));
      return true; // return true if batteryMax is less than secondmax
    }
    return false; // return false otherwise
  };

  const handleBatteryMaxClick = () => {
    const newBatteryMax = maxData.secondmax - 2;
    setBatteryMax(newBatteryMax);
  };

  useEffect(() => {
    const batteryStatusIsLow = checkBatteryStatus();
    if (batteryStatusIsLow) {
      setIsMaxUser(false); // set isMaxUser to false if battery status is low
    }
  }, [batteryMax]); // Watch batteryMax only

  useEffect(() => {
    if (maxData.secondmax) {
      const batteryStatusIsLow = checkBatteryStatus(); // Check battery status when maxData changes
      if (batteryStatusIsLow) {
        setIsMaxUser(false); // set isMaxUser to false if battery status is low
      }
    }
  }, [maxData]);

  useEffect(() => {
    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // Set timer to call fn() every 3 seconds while maxUser is true
    if (isMaxUser) {
      const interval = setInterval(() => {
        console.log("hi");
        easy();
      }, 3000);

      // Cleanup the interval when maxUser becomes false or component unmounts
      return () => clearInterval(interval);
    }
  }, [isMaxUser]);

  return (
    <div style={{ backgroundColor: bgColor, padding: '20px' }}>
      <button onClick={connectWebSocket}>Connect to WebSocket</button>

      {userId && (
        <div style={{ marginTop: '10px', color: 'blue' }}>
          <h4>Your User ID: {userId}</h4>
        </div>
      )}

      <div style={{ marginTop: '20px', border: '1px solid black', padding: '10px' }}>
        <h3>Messages</h3>
        {messages.length === 0 ? (
          <p style={{ color: 'green' }}>No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index} style={{ color: 'black' }}>
              {msg.sender}: {msg.message}
            </p>
          ))
        )}
      </div>

      {bgColor === 'yellow' && (
        <>
          <button onClick={sendBatteryValue}>Send Battery Value of 20</button>
          <button onClick={sendbig}>send Battery Value of 100</button>
          <button onClick={handleBatteryMaxClick}>stop</button>
        </>
      )}

      {isMaxUser && (
        <div style={{ backgroundColor: 'blue', padding: '20px', marginTop: '10px' }}>
          <button onClick={easy}>Send Focal Depth Data</button>
          <div style={{ marginTop: '10px', color: 'white' }}>
            <h4>Max Data:</h4>
            <p>First Max: {maxData.firstmax}</p>
            <p>Second Max: {maxData.secondmax}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
