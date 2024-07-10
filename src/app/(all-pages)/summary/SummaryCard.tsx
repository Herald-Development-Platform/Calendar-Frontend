import EventCard from "@/components/UpcommingEvents/EventCard";

export default function SummaryCard({
  title,
  events,
  loading = true,
}: {
  title: string;
  events: any;
  loading: boolean;
}) {
  return (
    <div
      className={`gap flex w-full max-w-[500px] flex-row items-start justify-center rounded-md border-[0.6px] border-[#D4D4D4] bg-neutral-50 px-8 py-6`}
    >
      <div className="flex flex-row items-start justify-start gap-4">
        {loading ? (
          <div className="h-[110px] w-full">
            <div className="h-[50px] w-full animate-pulse rounded-md bg-neutral-200"></div>
            <div className="h-[50px] w-full animate-pulse rounded-md bg-neutral-200"></div>
          </div>
        ) : (
          <>
            <span className=" w-24 text-center text-[57px] font-bold leading-[65px] text-[#5D9936]">
              {events?.length
                ? events?.length < 10
                  ? `0${events?.length}`
                  : events?.length
                : "00"}
            </span>
            <div className="flex flex-col gap-4">
              <span className=" text-[23px] font-bold text-neutral-500">
                {title}
              </span>
              <div className="flex flex-col">
                {events && events.length>0 && events.slice(0, 2)?.map((event: eventType, index:number) => (
                  <div
                    key={index}
                    style={{ borderColor: event.color }}
                    className={`flex flex-col items-start justify-start border border-b-0 border-l-4 border-r-0 border-t-0 pl-1`}
                  >
                    {/* <div className="flex w-full flex-wrap gap-1">
                      {event?.departments?.map((department: any, i: number) => {
                        return (
                          <div
                            className={`${
                              i === 0
                                ? "bg-neutral-400 text-white"
                                : "bg-white text-neutral-400"
                            } flex h-[12px] items-center justify-center rounded-[20px] border-[0.3px] border-neutral-400  px-[5px] text-[9px] `}
                          >
                            <span className="flex h-full items-center justify-center pt-[1px]">
                              {department?.code}
                            </span>
                          </div>
                        );
                      })}
                    </div> */}

                    <span className="truncate py-0 text-[11px] font-semibold leading-[14px] text-neutral-600">
                      {event && event?.title?.length > 20 ? event?.title.slice(0, 20) + "..." : event?.title ?? "" }
                    </span>
                  </div>
                ))}
                {events && events.length > 2 && (
                  <span className="text-[11px] font-semibold text-info-600">
                    + {events.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
