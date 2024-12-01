import React, { useEffect, useState } from 'react';
import { getDevices, updateDevice } from '../services/api'; // Giữ nguyên các dịch vụ API của bạn

const Home = () => {
  const [devices, setDevices] = useState([]);

  // Lấy danh sách thiết bị từ backend khi component được render
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data } = await getDevices();
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  // Hàm toggle để bật/tắt thiết bị
  const toggleDevice = async (id, currentStatus) => {
    try {
      // Gửi yêu cầu đến backend để thay đổi trạng thái thiết bị
      await updateDevice(id, !currentStatus);

      // Sau khi cập nhật, thay đổi trạng thái trong state frontend
      setDevices(devices.map((device) => 
        device._id === id ? { ...device, status: !currentStatus } : device
      ));
      
      // Gửi yêu cầu bật/tắt thiết bị tới ESP32 (bằng cách gọi API của backend)
      const toggleUrl = `http://localhost:5000/api/devices/toggle`; // Đảm bảo backend có route này
      await fetch(toggleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: id,  // ID của thiết bị
          status: !currentStatus // Trạng thái bật/tắt
        })
      });

    } catch (error) {
      console.error('Error toggling device:', error);
    }
  };

  return (
    <div>
      <h2>Device Control</h2>
      <ul>
        {devices.map((device) => (
          <li key={device._id}>
            {device.name} - Status: {device.status ? 'On' : 'Off'}
            <button onClick={() => toggleDevice(device._id, device.status)}>
              Toggle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
