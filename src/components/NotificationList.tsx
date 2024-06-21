import { Axios } from "@/services/baseUrl";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

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
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ["Notification"],
    queryFn: () => Axios.get("/notification"),
  });
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
        return null;
      default:
        break;
    }
  };
  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">
          Notifications
        </h1>
        <span className="text-[13px] text-primary-600">Mark all as Read</span>
      </div>
      <div className="mt-[40px] gap-4">
        {notificationsLoading ? (
          <div className="menu-title">Loading...</div>
        ) : notifications?.data?.data?.length === 0 ? (
          <div>No Notifications to View</div>
        ) : (
          notifications?.data?.data?.map((notification: any, i: any) => {
            let notificationDate = new Date(notification.date);
            let showDate = false;
            if (i === 0) {
              showDate = true;
            } else if (
              notificationDate.getDate() !==
              new Date(notifications?.data?.data[i - 1].createdAt).getDate()
            ) {
              showDate = true;
            }
            let icon = getNotificationIconLetter(notification);
            // let icon = false;
            return (
              <div
                key={notification._id}
                className="flex flex-col items-start gap-3"
              >
                {showDate && (
                  <div className="text-[13px] text-sm text-neutral-600">
                    {Math.abs(
                      new Date().getTime() - notificationDate.getTime(),
                    ) < 86400000
                      ? "Today"
                      : notificationDate.toDateString()}
                  </div>
                )}
                <div className="flex flex-row items-start justify-start gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${icon && "bg-primary-100"}`}
                  >
                    {icon ? (
                      <span className="text-md flex items-center justify-center text-primary-600">
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
                    <p className="text-[16px] text-neutral-900 ">
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
