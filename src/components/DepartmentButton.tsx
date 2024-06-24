import { RxCross2 } from "react-icons/rx";

export default function DepartmentButton({
  selected = false,
  selectedCross = true,
  value,
  handleQueryParams,
  id,
}: {
  id: string;
  selected?: boolean;
  value: any;
  handleQueryParams: (e: any) => void;
  selectedCross?: boolean;
}) {
  return (
    <>
      <button
        className={`focus: group flex h-fit w-fit cursor-pointer items-center gap-2 rounded-full border border-neutral-300 px-4  py-2  text-xs  leading-4  transition-colors  duration-300 ease-out  hover:bg-neutral-200 ${
          selected
            ? "bg-primary-500 text-white hover:bg-primary-600"
            : "text-black"
        }`}
        name="department"
        value={id}
        onClick={handleQueryParams}
      >
        {selectedCross && selected && (
          <span
            className={`${
              selected ? "flex text-lg  text-white" : "hidden"
            }  font-extrabold`}
          >
            <RxCross2 />
          </span>
        )}
        {value}
      </button>
    </>
  );
}
