"use client";
import { createContext, useContext, useEffect, useState } from "react";

import { io, Socket } from "socket.io-client";
import { Context } from "./ContextProvider";
import { useQueryClient } from "@tanstack/react-query";
import { baseUrl, webSocketUrl } from "@/services/baseUrl";

export interface ContextType {
  connection?: Socket;
}

export const WebSocketContext = createContext<{ connection?: Socket }>({});

export default function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const notifyMe = (data:any) => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      const notification = new Notification(`This is good`, {
        body: `Output: ${data}`,
        data,
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Permission granted")
          const notification = new Notification(`This is good`, {
            body: `Output: ${data}`,
            data,
          });
        }
      });
    }
  };
  const [connection, setConnection] = useState<Socket>();
  const { userData } = useContext(Context);
  const queryClient = useQueryClient();
  useEffect(() => {
    const connection = io(webSocketUrl);
    connection.on("connect", () => {
      setConnection(connection);
    });
    connection.on("notification", (notification) => {
      new Notification(
        notification.message || `New Notification`,
        {
          body: notification.message,
          data: notification,
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["Notification"],
      });
    });
    connection.on("disconnect", () => {
      console.log("disconnected");
    });
    return () => {
      connection.disconnect();
    };
  }, [userData]);

  return (
    <WebSocketContext.Provider
      value={{
        connection,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
