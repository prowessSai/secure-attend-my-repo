import { useEffect, useState,useRef, useCallback,} from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useAuth } from "../auth/AuthProvider";
import { getUnreadNotificationsCount } from "../interfaces/Notification";

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

const showBrowserNotification = (title: string, message: string) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'SAW-notification',
      requireInteraction: false,
      silent: false,
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};


const useNotifications = () => {
  const { getLoginUserInfo } = useAuth();
  const userInfo = getLoginUserInfo();
  const [notificationCount, setNotificationCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const prevCountRef = useRef<number>(0);
  const [snackQueue, setSnackQueue] = useState<any[]>([]);
  const [activeSnack, setActiveSnack] = useState<any | null>(null);
  
  const enqueueSnack = (data: any) => {
    setSnackQueue((prev) => [...prev, data]);
  };
  
  const handleSnackClose = () => {
    setActiveSnack(null);
  };
  
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  
  // Process snackbar queue
  useEffect(() => {
    if (!activeSnack && snackQueue.length > 0) {
      setActiveSnack(snackQueue[0]);
      setSnackQueue((prev) => prev.slice(1));
    }
  }, [activeSnack, snackQueue]);
    
  const playNotificationSound = () => {
    // Use default system notification sound by playing a silent audio
    // The browser notification API will use system sound when silent: false
    const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
    audio.play().catch((err) =>
      console.error("Notification sound error:", err)
    );
  };

  const updateCount = (newCount: number) => {
    setNotificationCount(newCount);
    prevCountRef.current = newCount;
  };
  
  const fetchUnreadNotifications = useCallback(async () => {
    if (userInfo?.userId) {
      try {
        const res = await getUnreadNotificationsCount();
        if (res !== undefined && res !== null) {
          updateCount(res);
        }
      } catch (err) {
        console.error("Failed to fetch unread notifications:", err);
      }
    }
  }, [userInfo?.userId]);


  useEffect(() => {
    if (!userInfo?.userId) return;

    const client = new Client({
      // webSocketFactory: () => new SockJS("http://192.168.2.21:8084/ws-notifications"),
      webSocketFactory: () => new SockJS("https://secureattend.veertrack.com/ws-sa-notifications"),
      // webSocketFactory: () => new SockJS('http://192.168.2.21:8080/ws-sa-notifications'),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {

        console.log("✅ Socket Connected");
        setConnected(true);

        if(userInfo?.userId){
          console.log("UserId:",userInfo.userId)
          console.log("Subscribing to:", `/topic/notifications/${userInfo?.userId}`);
          client.subscribe(`/topic/notifications/${userInfo.userId}`, async (message) => {
          console.log("Subscribed:")
          console.log("🔔 Socket message received:", message);
          const data = JSON.parse(message.body);
            console.log("socket data", data);
            if(data) {
              const res = await getUnreadNotificationsCount();
              if(res !== undefined && res !== null){
                updateCount(res);
                if(res > prevCountRef.current){
                  const notificationMessage = data.message || "You have a new notification";
                  
                  // Check if tab is active or in background
                  const isTabActive = !document.hidden;
                  
                  if (isTabActive) {
                    // Tab is active: Show in-app snackbar + sound
                    playNotificationSound();
                    enqueueSnack({
                      message: notificationMessage,
                    });
                  } else {
                    // Tab is inactive/minimized: Show browser notification + sound
                    showBrowserNotification('SAW', notificationMessage);
                  }
                }
              }
            }
        });
      }
      },
      onDisconnect: () => {
        console.log("❌ Socket Disconnected");
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [userInfo?.userId, fetchUnreadNotifications]);


  useEffect(() => {
    if (!userInfo?.userId) {
      console.log("User not ready, skipping initial fetch...");
      return;
    }
    fetchUnreadNotifications();
    
    // Poll for notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchUnreadNotifications]);

  const resetCount = () => setNotificationCount(0);

  return { notificationCount, connected, resetCount, refreshCount: fetchUnreadNotifications,activeSnack,handleSnackClose };
};

export default useNotifications;