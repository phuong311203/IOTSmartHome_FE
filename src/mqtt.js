import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const MQTTControl = () => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Thông số kết nối MQTT
  const brokerUrl = 'ws://your-mqtt-broker:port';
  const topic = 'esp32/control';

  useEffect(() => {
    // Kết nối MQTT
    const mqttClient = mqtt.connect(brokerUrl, {
      clientId: `frontend_${Math.random().toString(16).slice(2)}`,
    });

    mqttClient.on('connect', () => {
      console.log('MQTT Connected');
      setIsConnected(true);
      
      // Đăng ký nhận dữ liệu từ thiết bị
      mqttClient.subscribe(`${topic}/status`);
    });

    mqttClient.on('message', (receivedTopic, message) => {
      console.log(`Received message from ${receivedTopic}: ${message.toString()}`);
    });

    setClient(mqttClient);

    // Ngắt kết nối khi component bị hủy
    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  // Hàm điều khiển thiết bị
  const controlDevice = (action) => {
    if (client && isConnected) {
      client.publish(topic, JSON.stringify({
        action: action,
        timestamp: Date.now()
      }));
    }
  };

  return (
    <div>
      <h2>ESP32 MQTT Control</h2>
      <div>
        {isConnected ? (
          <p style={{color: 'green'}}>✓ MQTT Connected</p>
        ) : (
          <p style={{color: 'red'}}>✗ Disconnected</p>
        )}
      </div>
      <div>
        <button onClick={() => controlDevice('turnOn')}>
          Bật Thiết Bị
        </button>
        <button onClick={() => controlDevice('turnOff')}>
          Tắt Thiết Bị
        </button>
        <button onClick={() => controlDevice('toggleState')}>
          Đảo Trạng Thái
        </button>
      </div>
    </div>
  );
};

export default MQTTControl;