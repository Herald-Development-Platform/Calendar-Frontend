import { Context } from "@/app/clientWrappers/ContextProvider";
import { Axios } from "@/services/baseUrl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useContext } from "react";

const NOTIFICATION_CONTEXT = {
  DEPARTMENT_REQUEST: "DEPARTMENT_REQUEST",
  DEPARTMENT_JOIN: "DEPARTMENT_JOIN",
  ROLE_CHANGED: "ROLE_CHANGED",

  NEW_EVENT: "NEW_EVENT",
  UPCOMING_EVENT: "UPCOMING_EVENT",
  EVENT_CANCELLED: "EVENT_CANCELLED",
  EVENT_RESCHEDULED: "EVENT_RESCHEDULED",
};

export const NotificationList = (props: any) => {
  const queryClient = useQueryClient();
  const { notifications, notificationsLoading } = useContext(Context);
  console.log("Notifications", notifications);

  const getNotificationIconLetter = (notification: any) => {
    switch (notification.context) {
      case NOTIFICATION_CONTEXT.DEPARTMENT_JOIN:
        return "DJ";
      case NOTIFICATION_CONTEXT.DEPARTMENT_REQUEST:
        return "DR";
      case NOTIFICATION_CONTEXT.ROLE_CHANGED:
        return "RC";
      case NOTIFICATION_CONTEXT.NEW_EVENT:
        return "NE";
      case NOTIFICATION_CONTEXT.UPCOMING_EVENT:
        return "UE";
      case NOTIFICATION_CONTEXT.EVENT_CANCELLED:
        return "EC";
      case NOTIFICATION_CONTEXT.EVENT_RESCHEDULED:
        return "ER";
      default:
        break;
    }
  };

  const markAsRead = async (id?:string) => {
    try {
      if (id) {
        await Axios.get(`/notification/read/${id}`);
      } else {
        await Axios.get(`/notification/read`);
      }
      queryClient.invalidateQueries({
        queryKey: ["Notification"]
      })
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">
          Notifications
        </h1>
        <span
          onClick={()=>{
            markAsRead();
          }}
          className="text-[13px] cursor-pointer text-primary-600">
          Mark all as Read
          </span>
      </div>
      <div className="mt-[40px] flex flex-col gap-3  h-[400px] overflow-y-scroll">
        {notificationsLoading ? (
          <div className="menu-title">Loading...</div>
        ) : notifications?.length === 0 ? (
          <div>No Notifications to View</div>
        ) : (
          notifications?.map((notification: any, i: any) => {
            let notificationDate = new Date(notification.date);
            let showDate = false;
            if (i === 0) {
              showDate = true;
            } else if (
              notificationDate.getDate() !==
              new Date(notifications[i - 1].date).getDate()
            ) {
              console.log("Date from notification: ", notificationDate.getDate());
              console.log(
                "Date from previous notification: ",
                new Date(notifications[i - 1].date).getDate(),
              );
              showDate = true;
            }
            let icon = getNotificationIconLetter(notification);
            return (
              <div
              onMouseEnter={()=>{
                if (!notification.isRead) {
                  markAsRead(notification._id);
                }
              }}
                key={notification._id}
                className="flex flex-col items-start py-3"
              >
                {showDate && (
                  <div className="text-[13px] text-sm text-neutral-600 mb-3 font-semibold ">
                    {Math.abs(
                      new Date().getTime() - notificationDate.getTime(),
                    ) < (86400000/2)
                      ? "Today"
                      : notificationDate.toDateString()}
                  </div>
                )}
                <div className="flex flex-row items-start justify-start gap-2">
                  <div
                    className={`flex min-h-10 min-w-10 items-center flex-grow-0 relative justify-center rounded-full ${icon && "bg-primary-100"}`}
                  >
                    {
                      (!notification.isRead) && (<div>
                        <div className="bg-[#FA3E3E] min-w-[10px] min-h-[10px] rounded-full absolute top-0 right-0"></div>
                      </div>)
                    }
                    {icon ? (
                      <span  className="text-primary-600 h-full w-full flex justify-center items-center flex-grow-0">
                        {icon}
                      </span>
                    ) : (
                      <Image
                        className=" p-0.5 rounded-full"
                        width={32}
                        height={32}
                        src={"/images/LoginPage/HeraldLogo.png"}
                        alt="Herald Logo"
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-[16px] text-neutral-900 font-normal ">
                      {notification.message}
                    </p>
                    <span className="text-[13px] text-neutral-600">
                      {notificationDate.toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
      </div>
    </div>
  );
};
