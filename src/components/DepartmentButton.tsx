import clsx from "clsx";
import { RxCross2 } from "react-icons/rx";

export default function DepartmentButton({
  selected = false,
  selectedCross = true,
  value,
  onClick,
  id,
  className,
}: {
  id: string;
  selected?: boolean;
  value: any;
  onClick: (e: any) => void;
  selectedCross?: boolean;
  className?: string;
}) {
  return (
    <>
      <button
        type="button"
        className={clsx(
          `group flex h-fit w-fit cursor-pointer items-center gap-2 text-nowrap rounded-full border border-neutral-300 px-4 py-2 text-xs leading-4 transition-colors  duration-300 ease-out  hover:bg-neutral-200 ${
            selected ? "bg-primary-500 text-white hover:bg-primary-600" : "text-black"
          }`,
          className
        )}
        name="department"
        value={id}
        onClick={onClick}
        key={id}
      >
        {selectedCross && selected && (
          <span className={` ${selected ? "flex text-lg  text-white" : "hidden"}  font-extrabold`}>
            <RxCross2 />
          </span>
        )}
        {value}
      </button>
    </>
  );
}
