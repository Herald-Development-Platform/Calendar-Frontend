import { FunctionComponent } from "react";

export type EventsType = {
  className?: string;
};

const Events: FunctionComponent<EventsType> = ({ className = "" }) => {
  return (
    <div
      className={`bg-tomato-200 box-border flex h-[107px] w-[312px] shrink-0 flex-row items-start justify-start gap-3 overflow-hidden pb-2 pl-0 pr-4 pt-0 leading-[normal] tracking-[normal] ${className}`}
    >
      <div className="bg-tomato-100 relative h-[200px] w-1" />
      <section className="text-2xs font-caption-medium flex flex-1 flex-col items-start justify-start px-0 pb-0 pt-2 text-left text-neutral-400">
        <div className="relative flex flex-col items-start justify-center gap-1 self-stretch">
          <div className="flex flex-row items-center justify-end py-0 pl-0 pr-5">
            <div className="flex flex-row items-center justify-start gap-[3px]">
              <div className="box-border flex h-[15px] flex-row items-center justify-center overflow-hidden rounded-xl border-[0.4px] border-solid border-neutral-400 bg-neutral-400 px-1 py-0 text-neutral-100">
                <a className="relative inline-block min-w-[42px] leading-[16px] text-[inherit] [text-decoration:none]">
                  Finance
                </a>
              </div>
              <div className="box-border flex h-[15px] w-8 shrink-0 flex-row items-center justify-center overflow-hidden rounded-xl border-[0.4px] border-solid border-neutral-400 bg-neutral-100 px-1 py-0">
                <a className="relative inline-block min-w-[23px] leading-[16px] text-[inherit] [text-decoration:none]">
                  SSD
                </a>
              </div>
              <div className="box-border flex h-[15px] flex-row items-center justify-center overflow-hidden rounded-xl border-[0.4px] border-solid border-neutral-400 bg-neutral-100 px-[5px] py-0">
                <a className="relative inline-block min-w-[16px] leading-[16px] text-[inherit] [text-decoration:none]">
                  BD
                </a>
              </div>
            </div>
          </div>
          <h3 className="relative m-0 self-stretch font-[inherit] text-base font-medium leading-[24px] text-neutral-800">
            <p className="m-0">Communities Meeting</p>
            <p className="m-0">For Overflow</p>
          </h3>
          <div className="text-smi relative whitespace-nowrap font-medium leading-[20px] text-neutral-500">
            04:00 pm - 06:00 pm
          </div>
          <a className="text-tomato-100 absolute right-[-10px] top-[0px] z-[1] !m-[0] inline-block min-w-[18px] font-medium leading-[16px] [text-decoration:none]">
            MD
          </a>
        </div>
      </section>
    </div>
  );
};

export default Events;
