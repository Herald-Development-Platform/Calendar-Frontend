"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TbCloudUpload, TbCloudDownload } from "react-icons/tb";
import { FaRegFile } from "react-icons/fa6";
import { Axios } from "@/services/baseUrl";
import DepartmentButton from "@/components/DepartmentButton";
import { BiPencil } from "react-icons/bi";
import ContextProvider, { Context } from "@/app/clientWrappers/ContextProvider";

export default function ImportExport() {
  const [currentTab, setCurrentTab] = useState("import");
  const [importFileData, setImportFileData] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [exportFilename, setExportFilename] = useState("Calendar");

  const { userData } = useContext(Context);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (userData?.department?.code && departments.length > 0) {
      setSelectedDepartments([userData?.department?.code]);
    }
  }, [userData, departments]);

  useEffect(() => {
    if (currentTab === "export") {
      if (userData?.department?.code) {
        setSelectedDepartments([userData?.department?.code]);
      } else {
        setSelectedDepartments([]);
      }
    }
  }, [currentTab]);

  const handleFileInput = (e: any) => {
    if (e.target.files.length === 0) return;
    const reader = new FileReader();
    const file = e.target.files[0];

    setSelectedFile(file);
    reader.onload = (e) => {
      const data = e.target?.result;
      setImportFileData(data);
      setDialogOpen(true);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importFileData) {
      toast.error("Please select a file to import");
      setDialogOpen(false);
      return;
    }
    if (selectedDepartments.length === 0) {
      toast.error("Please select at least one department");
      return;
    }

    try {
      const response = await Axios.post(`/event/fromIcs`, {
        icsString: importFileData,
        departments: selectedDepartments,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log("Error importing file:", error);
    }
    setDialogOpen(false);
  };

  const handleExport = async () => {
    if (selectedDepartments.length === 0) {
      toast.error("Please select at least one department");
      return;
    }
    try {
      const response = await Axios.post(`/event/exportIcs`, {
        departments: selectedDepartments,
      });
      console.log("Export response: ", response);
      if (!response.data?.success) {
        toast.error(response.data?.message || "Error exporting calendar");
        return;
      }
      const blob = new Blob([response?.data?.data], {
        type: "text/calendar",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportFilename}.ics`;
      a.click();
    } catch (error: any) {
      if (error?.response) {
        toast.error(
          error?.response?.data?.message ||
            "Error exporting events to ics file",
        );
      }
    }
    setDialogOpen(false);
  };

  const fetchDepartments = async () => {
    try {
      const response = await Axios.get(`/department`);
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const formatFileSize = (size: number) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="flex flex-col gap-9 px-[70px] pl-9">
      <Toaster />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" text-[19px] font-semibold ">
              {currentTab === "import" ? "Import" : "Export"} Calendar
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-8">
            {currentTab === "import" ? (
              <div className=" flex w-full flex-row items-center justify-center gap-2.5 rounded-md bg-neutral-100 px-3 py-4 text-neutral-500">
                <span className="flex items-center justify-center text-3xl">
                  <FaRegFile />
                </span>
                <div className="flex flex-col items-start justify-center gap-[3px]">
                  <span className="text-[13px]">{selectedFile?.name}</span>
                  <span className="text-[9px]">
                    {formatFileSize(selectedFile?.size || 0)}
                  </span>
                </div>
              </div>
            ) : (
              <label htmlFor="add-title">
                <div className="group flex h-11 w-full items-center gap-2  border-b-[1px] border-neutral-300 px-4 focus-within:border-primary-600">
                  <span className="text-xl">
                    <BiPencil />
                  </span>
                  <input
                    type="text"
                    value={exportFilename}
                    onChange={(e) => {
                      // if (e.target.value.includes(".ics")) {
                      //   setExportFilename(e.target.value);
                      // } else {
                      //   setExportFilename(e.target.value + ".ics");
                      // }
                      setExportFilename(e.target.value);
                    }}
                    placeholder="Enter Filename"
                    className="w-full text-lg font-normal text-neutral-900 outline-none"
                  />
                </div>
              </label>
            )}
            <div className=" flex flex-col gap-2 ">
              <span className="font-500 text-[14px]">
                Departments
                <br />
              </span>
              <div className=" flex flex-row flex-wrap items-center justify-start gap-2">
                {departments.map((department: Department) => (
                  <DepartmentButton
                    key={department._id}
                    selectedCross={false}
                    onClick={() => {
                      if (
                        currentTab === "import" ||
                        userData?.role === "SUPER_ADMIN"
                      ) {
                        let newSelectedDepartments = [...selectedDepartments];
                        if (
                          userData?.department?.code === department.code &&
                          newSelectedDepartments.includes(department.code)
                        ) {
                          return;
                        }
                        if (newSelectedDepartments.includes(department.code)) {
                          newSelectedDepartments =
                            newSelectedDepartments.filter(
                              (code) => code !== department.code,
                            );
                        } else {
                          newSelectedDepartments.push(department.code);
                        }
                        setSelectedDepartments(newSelectedDepartments);
                      } else if (currentTab === "export") {
                        if (userData?.department?.code) {
                          setSelectedDepartments([userData?.department?.code]);
                        }
                      }
                    }}
                    value={department.code}
                    selected={selectedDepartments.includes(department.code)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className=" flex flex-row items-center justify-end py-4">
            <button
              onClick={() => {
                setDialogOpen(false);
                setImportFileData(null);
              }}
              className="btn btn-md h-5 border-none bg-red-400 text-[13px] font-medium text-primary-50 hover:bg-red-500"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (currentTab === "import") {
                  handleImport();
                } else {
                  handleExport();
                }
              }}
              className="btn btn-md h-5 border-none bg-primary-600 text-[13px] font-medium text-primary-50 hover:bg-primary-700"
            >
              {currentTab === "import" ? "Import" : "Export"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className=" mt-[80px] flex flex-col gap-[27px]">
        <div className="flex flex-row justify-between">
          <h1 className=" text-[28px] font-[700] text-neutral-700">
            Import/ Export
          </h1>
        </div>
        <div className="flex flex-row items-center justify-start gap-4 text-neutral-500">
          <span
            onClick={() => {
              setCurrentTab("import");
            }}
            className={`${currentTab === "import" ? "text-primary-700 underline underline-offset-4" : ""} cursor-pointer `}
          >
            Import
          </span>
          <span
            onClick={() => {
              setCurrentTab("export");
            }}
            className={`${currentTab === "export" ? "text-primary-700 underline underline-offset-4" : ""} cursor-pointer `}
          >
            Export
          </span>
        </div>
        <div
          className="relative flex h-[105px] w-full items-center justify-center rounded-[4px] border border-dashed border-[#D0D5DD] bg-primary-50"
          onClick={() => {
            if (currentTab === "import") {
              return;
            }
            setDialogOpen(true);
          }}
        >
          {currentTab === "import" && (
            <input
              onChange={handleFileInput}
              className="absolute left-0 top-0 h-full w-full cursor-pointer bg-red-300 opacity-0"
              type="file"
              multiple={false}
            />
          )}
          <div className=" flex w-[240px] cursor-pointer flex-col items-center gap-[10px]">
            <span className={`h-[24px] w-[24px] text-xl text-primary-600`}>
              {currentTab === "import" ? (
                <TbCloudUpload />
              ) : (
                <TbCloudDownload />
              )}
            </span>
            <p className="text-center text-[13px] font-normal text-neutral-500">
              Browse and choose the file you want to import from your device
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
