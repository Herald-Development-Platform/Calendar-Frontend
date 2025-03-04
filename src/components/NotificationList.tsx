import { Context } from "@/app/clientWrappers/ContextProvider";
import { useUpdateProfileMutation } from "@/services/api/profile";
import { Axios } from "@/services/baseUrl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import HeraldLogo from "@/imgs/images/heraldLogo.svg";
import { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NOTIFICATION_CONTEXT = {
  DEPARTMENT_REQUEST: "DEPARTMENT_REQUEST",
  DEPARTMENT_JOIN: "DEPARTMENT_JOIN",
  ROLE_CHANGED: "ROLE_CHANGED",

  NEW_EVENT: "NEW_EVENT",
  UPCOMING_EVENT: "UPCOMING_EVENT",
  EVENT_CANCELLED: "EVENT_CANCELLED",
  EVENT_RESCHEDULED: "EVENT_RESCHEDULED",
};

const DONOT_DISTURB_STATE = {
  DEFAULT: "-",
  ONE_HOUR: "1",
  THREE_HOUR: "3",
  SIX_HOUR: "6",
  TWELVE_HOUR: "12",
  TWENTYFOUR_FOUR: "24",
  UNTIL: "UNTIL",
};

export const NotificationList = (props: any) => {
  const queryClient = useQueryClient();
  const { notifications, notificationsLoading } = useContext(Context);

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

  const markAsRead = async (id?: string) => {
    try {
      if (id) {
        await Axios.get(`/notification/read/${id}`);
      } else {
        await Axios.get(`/notification/read`);
      }
      queryClient.invalidateQueries({
        queryKey: ["Notification"],
      });
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  };

  const { userData: profile } = useContext(Context);

  const { mutate: updateProfile } = useUpdateProfileMutation();

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">
          Notifications
        </h1>
        <span
          onClick={() => {
            markAsRead();
          }}
          className="cursor-pointer text-[13px] text-primary-600"
        >
          Mark all as Read
        </span>
      </div>

      <Tabs defaultValue="all" className="mt-[20px]">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="already-read">Already Read</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="w-full">
          <div className="mt-[20px] flex h-[400px] w-full  flex-col gap-3 overflow-y-scroll">
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
                  showDate = true;
                }
                let icon = getNotificationIconLetter(notification);
                return (
                  <div
                    onMouseEnter={() => {
                      if (!notification.isRead) {
                        markAsRead(notification._id);
                      }
                    }}
                    key={notification._id}
                    className="flex flex-col items-start py-3"
                  >
                    {showDate && (
                      <div className="mb-3 text-[13px] text-sm font-semibold text-neutral-600 ">
                        {Math.abs(
                          new Date().getTime() - notificationDate.getTime(),
                        ) <
                        86400000 / 2
                          ? "Today"
                          : notificationDate.toDateString()}
                      </div>
                    )}
                    <div className="flex flex-row items-start justify-start gap-2">
                      <div
                        className={`relative flex min-h-10 min-w-10 flex-grow-0 items-center justify-center rounded-full ${icon && "bg-primary-100"}`}
                      >
                        {!notification.isRead && (
                          <div>
                            <div className="absolute right-0 top-0 min-h-[10px] min-w-[10px] rounded-full bg-[#FA3E3E]"></div>
                          </div>
                        )}
                        {icon ? (
                          <span className="flex h-full w-full flex-grow-0 items-center justify-center text-primary-600">
                            {icon}
                          </span>
                        ) : (
                          <Image
                            className=" rounded-full p-0.5"
                            width={32}
                            height={32}
                            src={HeraldLogo}
                            alt="Herald Logo"
                          />
                        )}
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <p className="text-[16px] font-normal text-neutral-900 ">
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
        </TabsContent>
        <TabsContent value="unread">
          <div className="mt-[20px] flex h-[400px] flex-col  gap-3 overflow-y-scroll">
            {notificationsLoading ? (
              <div className="menu-title">Loading...</div>
            ) : notifications?.filter((not) => !not.isRead)?.length === 0 ? (
              <div>No Unread Notifications to View</div>
            ) : (
              notifications
                ?.filter((not) => !not.isRead)
                .map((notification: any, i: any) => {
                  let notificationDate = new Date(notification.date);
                  let showDate = false;
                  if (i === 0) {
                    showDate = true;
                  } else if (
                    notificationDate.getDate() !==
                    new Date(notifications[i - 1].date).getDate()
                  ) {
                    showDate = true;
                  }
                  let icon = getNotificationIconLetter(notification);
                  return (
                    <div
                      onMouseEnter={() => {
                        if (!notification.isRead) {
                          markAsRead(notification._id);
                        }
                      }}
                      key={notification._id}
                      className="flex flex-col items-start py-3"
                    >
                      {showDate && (
                        <div className="mb-3 text-[13px] text-sm font-semibold text-neutral-600 ">
                          {Math.abs(
                            new Date().getTime() - notificationDate.getTime(),
                          ) <
                          86400000 / 2
                            ? "Today"
                            : notificationDate.toDateString()}
                        </div>
                      )}
                      <div className="flex flex-row items-start justify-start gap-2">
                        <div
                          className={`relative flex min-h-10 min-w-10 flex-grow-0 items-center justify-center rounded-full ${icon && "bg-primary-100"}`}
                        >
                          {!notification.isRead && (
                            <div>
                              <div className="absolute right-0 top-0 min-h-[10px] min-w-[10px] rounded-full bg-[#FA3E3E]"></div>
                            </div>
                          )}
                          {icon ? (
                            <span className="flex h-full w-full flex-grow-0 items-center justify-center text-primary-600">
                              {icon}
                            </span>
                          ) : (
                            <Image
                              className=" rounded-full p-0.5"
                              width={32}
                              height={32}
                              src={HeraldLogo}
                              alt="Herald Logo"
                            />
                          )}
                        </div>
                        <div className="flex flex-col items-start justify-center">
                          <p className="text-[16px] font-normal text-neutral-900 ">
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
        </TabsContent>
        <TabsContent value="already-read">
          <div className="mt-[20px] flex h-[400px] flex-col  gap-3 overflow-y-scroll">
            {notificationsLoading ? (
              <div className="menu-title">Loading...</div>
            ) : notifications?.filter((not) => not.isRead)?.length === 0 ? (
              <div>No Already Read Notifications to View</div>
            ) : (
              notifications
                ?.filter((not) => not.isRead)
                .map((notification: any, i: any) => {
                  let notificationDate = new Date(notification.date);
                  let showDate = false;
                  if (i === 0) {
                    showDate = true;
                  } else if (
                    notificationDate.getDate() !==
                    new Date(notifications[i - 1].date).getDate()
                  ) {
                    showDate = true;
                  }
                  let icon = getNotificationIconLetter(notification);
                  return (
                    <div
                      onMouseEnter={() => {
                        if (!notification.isRead) {
                          markAsRead(notification._id);
                        }
                      }}
                      key={notification._id}
                      className="flex flex-col items-start py-3"
                    >
                      {showDate && (
                        <div className="mb-3 text-[13px] text-sm font-semibold text-neutral-600 ">
                          {Math.abs(
                            new Date().getTime() - notificationDate.getTime(),
                          ) <
                          86400000 / 2
                            ? "Today"
                            : notificationDate.toDateString()}
                        </div>
                      )}
                      <div className="flex flex-row items-start justify-start gap-2">
                        <div
                          className={`relative flex min-h-10 min-w-10 flex-grow-0 items-center justify-center rounded-full ${icon && "bg-primary-100"}`}
                        >
                          {!notification.isRead && (
                            <div>
                              <div className="absolute right-0 top-0 min-h-[10px] min-w-[10px] rounded-full bg-[#FA3E3E]"></div>
                            </div>
                          )}
                          {icon ? (
                            <span className="flex h-full w-full flex-grow-0 items-center justify-center text-primary-600">
                              {icon}
                            </span>
                          ) : (
                            <Image
                              className=" rounded-full p-0.5"
                              width={32}
                              height={32}
                              src={HeraldLogo}
                              alt="Herald Logo"
                            />
                          )}
                        </div>
                        <div className="flex flex-col items-start justify-center">
                          <p className="text-[16px] font-normal text-neutral-900 ">
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
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end gap-2 py-2">
        <span className="text-[14px] font-semibold text-neutral-700">
          Don&apos;t disturb for
        </span>
        <div className="w-fit text-[11px] font-normal text-black">
          <Select
            onValueChange={(value) => {
              let plusHour = 0;
              switch (value) {
                case DONOT_DISTURB_STATE.DEFAULT:
                  plusHour = -1;
                  break;
                case DONOT_DISTURB_STATE.ONE_HOUR:
                  plusHour = 1;
                  break;
                case DONOT_DISTURB_STATE.THREE_HOUR:
                  plusHour = 3;
                  break;
                case DONOT_DISTURB_STATE.SIX_HOUR:
                  plusHour = 6;
                  break;
                case DONOT_DISTURB_STATE.TWELVE_HOUR:
                  plusHour = 12;
                  break;
                case DONOT_DISTURB_STATE.TWENTYFOUR_FOUR:
                  plusHour = 24;
                  break;
                case DONOT_DISTURB_STATE.UNTIL:
                  plusHour = 8766; // 1 year
                  break;
              }
              let expiryDate = new Date(
                new Date().getTime() + 1000 * 60 * 60 * plusHour,
              );
              updateProfile(
                {
                  ...profile,
                  donotDisturbState: value,
                  notificationExpiry: expiryDate,
                },
                {
                  onSuccess: () => {
                    toast.success("Don't disturb state updated successfully.");
                    queryClient.invalidateQueries({
                      queryKey: ["profile"],
                    });
                  },
                },
              );
            }}
            value={profile?.donotDisturbState ?? DONOT_DISTURB_STATE.DEFAULT}
          >
            <SelectTrigger className="h-7 gap-2 border-none bg-neutral-200 font-semibold text-black outline-none ring-0">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent className="h-fit border-none py-0  pr-2 outline-none ring-0 ">
              <SelectItem value={DONOT_DISTURB_STATE.DEFAULT}>
                Not set
              </SelectItem>
              <SelectItem value={DONOT_DISTURB_STATE.ONE_HOUR}>
                1 hrs
              </SelectItem>
              <SelectItem value={DONOT_DISTURB_STATE.THREE_HOUR}>
                3 hrs
              </SelectItem>
              <SelectItem value={DONOT_DISTURB_STATE.SIX_HOUR}>
                6 hrs
              </SelectItem>
              <SelectItem value={DONOT_DISTURB_STATE.TWELVE_HOUR}>
                12 hrs
              </SelectItem>
              <SelectItem value={DONOT_DISTURB_STATE.TWENTYFOUR_FOUR}>
                24 hrs
              </SelectItem>
              <SelectItem value={DONOT_DISTURB_STATE.UNTIL}>
                Until reset
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
