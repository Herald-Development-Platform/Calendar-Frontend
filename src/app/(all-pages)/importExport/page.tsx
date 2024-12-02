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
import { Context } from "@/app/clientWrappers/ContextProvider";
import { useMutation } from "@tanstack/react-query";
import * as Headers from "@/components/Header";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RxCross2 } from "react-icons/rx";
import { PERMISSIONS } from "@/constants/permissions";

export default function ImportExport() {
  const [currentTab, setCurrentTab] = useState("import");
  const [importFileData, setImportFileData] = useState<any>(null);
  const [eventsDialogOpen, setEventDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [semesterDialogOpen, setSemesterDialogOpen] = useState(false);
  const [uploadErrorDialogOpen, setUploadErrorDialogOpen] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<any>([]);

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
      setEventDialogOpen(true);
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: any) => {
    if (e.target.files.length === 0) return;
    const reader = new FileReader();
    const file = e.target.files[0];

    setSelectedFile(file);
    reader.onload = (e) => {
      const data = e.target?.result;
      setImportFileData(data);
      setEventDialogOpen(true);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importFileData) {
      toast.error("Please select a file to import");
      setEventDialogOpen(false);
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
    } catch (error) {}
    setEventDialogOpen(false);
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
    setEventDialogOpen(false);
  };

  const { mutate: postMemberFiles, isPending: membersUploading } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await Axios.post("/user/addUsers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Success");
      setMemberDialogOpen(false);
      if (data.data.uploadReportFilename) {
        // download the file data, set it to form and download
        Axios.get(`/userUploadReport/${data.data.uploadReportFilename}`, {
          responseType: "blob",
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "upload_report.xlsx");
          document.body.appendChild(link);
          link.click();
        });
      }
    },
    onError: (err: any) => {
      setUploadErrors(err?.response?.data?.data || []);
      setMemberDialogOpen(false);
      setUploadErrorDialogOpen(true);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    },
  });

  const locationUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await Axios.post("/location/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Success");
      setLocationDialogOpen(false);
    },
    onError: (err: any) => {
      setUploadErrors(err?.response?.data?.data || []);
      setLocationDialogOpen(false);
      setUploadErrorDialogOpen(true);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    },
  });

  const departmentUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await Axios.post("/department/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Success");
      setDepartmentDialogOpen(false);
    },
    onError: (err: any) => {
      setUploadErrors(err?.response?.data?.data || []);
      setDepartmentDialogOpen(false);
      setUploadErrorDialogOpen(true);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    },
  });

  const semesterUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await Axios.post("/semester/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Success");
      setSemesterDialogOpen(false);
    },
    onError: (err: any) => {
      setUploadErrors(err?.response?.data?.data || []);
      setSemesterDialogOpen(false);
      setUploadErrorDialogOpen(true);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    },
  });

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

  const router = useRouter();

  return (
    <>
      <Headers.GeneralHeader />
      <div className="mb-10 flex max-h-[100vh] flex-col gap-9 overflow-y-scroll px-[70px] pl-9">
        <Toaster />
        <Dialog
          open={uploadErrorDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setUploadErrors([]);
            }
            setUploadErrorDialogOpen(open);
          }}
        >
          <DialogContent
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
            className=" max-h-[80vh] min-w-[80vw] overflow-y-scroll"
          >
            <DialogHeader>
              <DialogTitle className=" flex items-center justify-between text-[19px] font-semibold ">
                Upload Errors
                <button
                  onClick={() => {
                    setUploadErrors([]);
                    setUploadErrorDialogOpen(false);
                  }}
                >
                  <RxCross2 />
                </button>
              </DialogTitle>
            </DialogHeader>
            <div className=" flex flex-col justify-start gap-7">
              {uploadErrors &&
                uploadErrors.length &&
                uploadErrors.map((errObject: any, i: number) => (
                  <div key={i} className="bg-red-200 p-3">
                    <div className="flex flex-col items-start justify-start">
                      <p className="font-500 text-[16px] text-neutral-800">
                        Error #{i + 1}: {errObject.reason}
                      </p>
                      <span className="font-400 text-[13px] text-neutral-600">
                        Sheet: {errObject.sheetName}
                      </span>
                      <span className="font-400 text-[13px] text-neutral-600">
                        Row Index: {errObject.rowIndex}
                      </span>
                    </div>
                    <Table className="bg-neutral-50">
                      <TableHeader>
                        <TableRow>
                          {Object.keys(errObject.originalRow).map((key) => (
                            <TableCell className="font-600" key={key}>
                              {key}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          {Object.keys(errObject.originalRow).map((key) => (
                            <TableCell key={key}>
                              {errObject.originalRow[key]}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={eventsDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedFile(undefined);
            }
            setEventDialogOpen(open);
          }}
        >
          <DialogContent
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
          >
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
                      id={department._id}
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
                          if (
                            newSelectedDepartments.includes(department.code)
                          ) {
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
                            setSelectedDepartments([
                              userData?.department?.code,
                            ]);
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
                  setEventDialogOpen(false);
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
        <Dialog
          open={memberDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedFile(undefined);
            }
            setMemberDialogOpen(open);
          }}
        >
          <DialogContent
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle className=" text-[19px] font-semibold ">
                Import Member
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-8">
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
            </div>
            <DialogFooter className=" flex flex-row items-center justify-end py-4">
              <button
                onClick={() => {
                  setMemberDialogOpen(false);
                }}
                className="btn btn-md h-5 border-none bg-red-400 text-[13px] font-medium text-primary-50 hover:bg-red-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  selectedFile
                    ? postMemberFiles(selectedFile)
                    : toast.error("File is not selected.");
                }}
                className="btn btn-md h-5 border-none bg-primary-600 text-[13px] font-medium text-primary-50 hover:bg-primary-700"
                disabled={membersUploading}
              >
                {currentTab === "import" ? "Import" : "Export"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={locationDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedFile(undefined);
            }
            setLocationDialogOpen(open);
          }}
        >
          <DialogContent
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle className=" text-[19px] font-semibold ">
                Import Location
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-8">
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
            </div>
            <DialogFooter className=" flex flex-row items-center justify-end py-4">
              <button
                onClick={() => {
                  setLocationDialogOpen(false);
                }}
                className="btn btn-md h-5 border-none bg-red-400 text-[13px] font-medium text-primary-50 hover:bg-red-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  selectedFile
                    ? locationUploadMutation.mutate(selectedFile)
                    : toast.error("File is not selected.");
                }}
                disabled={locationUploadMutation.isPending}
                className="btn btn-md h-5 border-none bg-primary-600 text-[13px] font-medium text-primary-50 hover:bg-primary-700"
              >
                Import
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={departmentDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedFile(undefined);
            }
            setDepartmentDialogOpen(open);
          }}
        >
          <DialogContent
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle className=" text-[19px] font-semibold ">
                Import Departments
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-8">
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
            </div>
            <DialogFooter className=" flex flex-row items-center justify-end py-4">
              <button
                onClick={() => {
                  setLocationDialogOpen(false);
                }}
                className="btn btn-md h-5 border-none bg-red-400 text-[13px] font-medium text-primary-50 hover:bg-red-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  selectedFile
                    ? departmentUploadMutation.mutate(selectedFile)
                    : toast.error("File is not selected.");
                }}
                disabled={departmentUploadMutation.isPending}
                className="btn btn-md h-5 border-none bg-primary-600 text-[13px] font-medium text-primary-50 hover:bg-primary-700"
              >
                Import
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={semesterDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedFile(undefined);
            }
            setDepartmentDialogOpen(open);
          }}
        >
          <DialogContent
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle className=" text-[19px] font-semibold ">
                Import Semesters
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-8">
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
            </div>
            <DialogFooter className=" flex flex-row items-center justify-end py-4">
              <button
                onClick={() => {
                  setSemesterDialogOpen(false);
                }}
                className="btn btn-md h-5 border-none bg-red-400 text-[13px] font-medium text-primary-50 hover:bg-red-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  selectedFile
                    ? semesterUploadMutation.mutate(selectedFile)
                    : toast.error("File is not selected.");
                }}
                disabled={semesterUploadMutation.isPending}
                className="btn btn-md h-5 border-none bg-primary-600 text-[13px] font-medium text-primary-50 hover:bg-primary-700"
              >
                Import
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className=" mt-[20px] flex flex-col gap-[37px]">
          <div className="flex flex-row items-center justify-start gap-3">
            <span
              onClick={() => {
                router.back();
              }}
              className="cursor-pointer text-4xl font-bold text-neutral-600"
            >
              <IoMdArrowBack />
            </span>
            <h1 className=" text-[28px] font-[700] text-neutral-700">
              Import/ Export
            </h1>
          </div>
          <div className="flex w-full flex-row items-center justify-start gap-4 text-neutral-500">
            <span
              onClick={() => {
                setCurrentTab("import");
              }}
              className={`${
                currentTab === "import"
                  ? "text-primary-700 underline underline-offset-4"
                  : ""
              } cursor-pointer `}
            >
              Import
            </span>
            <span
              onClick={() => {
                setCurrentTab("export");
              }}
              className={`${
                currentTab === "export"
                  ? "text-primary-700 underline underline-offset-4"
                  : ""
              } cursor-pointer `}
            >
              Export
            </span>
          </div>
          {currentTab === "import" ? (
            <>
              <div className="space-y-2">
                <h1>Import Calendar</h1>
                <div
                  className="relative flex h-[105px] w-full items-center justify-center rounded-[4px] border border-dashed border-[#D0D5DD] bg-primary-50 "
                  onClick={() => {
                    if (currentTab === "import") {
                      return;
                    }
                    // setDialogOpen(true);
                  }}
                >
                  <input
                    onClick={(e) => {
                      //@ts-ignore
                      e.target.file = [];
                      //@ts-ignore
                      e.target.value = "";
                    }}
                    onChange={handleFileInput}
                    className="absolute left-0 top-0 h-full w-full cursor-pointer bg-red-300 opacity-0"
                    type="file"
                    multiple={false}
                  />
                  <div className=" flex w-[240px] cursor-pointer flex-col items-center gap-[10px]">
                    <span
                      className={`h-[24px] w-[24px] text-xl text-primary-600`}
                    >
                      <TbCloudDownload></TbCloudDownload>
                    </span>
                    <p className="text-center text-[13px] font-normal text-neutral-500">
                      Browse and choose the file you want to import from your
                      device
                    </p>
                  </div>
                </div>
              </div>
              {userData?.permissions?.includes(
                PERMISSIONS.CREATE_DEPARTMENT,
              ) && (
                <div className="space-y-2">
                  <h1>Import Departments</h1>
                  <div className="relative flex h-[105px] w-full items-center justify-center rounded-[4px] border border-dashed border-[#D0D5DD] bg-primary-50">
                    <input
                      onClick={(e) => {
                        //@ts-ignore
                        e.target.file = [];
                        //@ts-ignore
                        e.target.value = "";
                      }}
                      onChange={(e: any) => {
                        if (e.target.files.length === 0) return;
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        setDepartmentDialogOpen(true);
                      }}
                      className="absolute left-0 top-0 h-full w-full cursor-pointer bg-red-300 opacity-0"
                      type="file"
                      multiple={false}
                    />
                    <div className=" flex w-[240px] cursor-pointer flex-col items-center gap-[10px]">
                      <span
                        className={`h-[24px] w-[24px] text-xl text-primary-600`}
                      >
                        <TbCloudDownload />
                      </span>
                      <p className="text-center text-[13px] font-normal text-neutral-500">
                        Browse and choose the file you want to import from your
                        device
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {userData?.permissions?.includes(PERMISSIONS.CREATE_USER) && (
                <div className="space-y-2">
                  <h1>Import Members</h1>
                  <div
                    className="relative flex h-[105px] w-full items-center justify-center rounded-[4px] border border-dashed border-[#D0D5DD] bg-primary-50"
                    // onClick={() => {
                    // }}
                  >
                    <input
                      onClick={(e) => {
                        //@ts-ignore
                        e.target.file = [];
                        //@ts-ignore
                        e.target.value = "";
                      }}
                      onChange={(e: any) => {
                        if (e.target.files.length === 0) return;
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        setMemberDialogOpen(true);
                      }}
                      className="absolute left-0 top-0 h-full w-full cursor-pointer bg-red-300 opacity-0"
                      type="file"
                      multiple={false}
                    />
                    <div className=" flex w-[240px] cursor-pointer flex-col items-center gap-[10px]">
                      <span
                        className={`h-[24px] w-[24px] text-xl text-primary-600`}
                      >
                        <TbCloudDownload></TbCloudDownload>
                      </span>
                      <p className="text-center text-[13px] font-normal text-neutral-500">
                        Browse and choose the file you want to import from your
                        device
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {userData?.permissions?.includes(PERMISSIONS.CREATE_LOCATION) && (
                <div className="space-y-2">
                  <h1>Import Locations</h1>
                  <div className="relative flex h-[105px] w-full items-center justify-center rounded-[4px] border border-dashed border-[#D0D5DD] bg-primary-50">
                    <input
                      onClick={(e) => {
                        //@ts-ignore
                        e.target.file = [];
                        //@ts-ignore
                        e.target.value = "";
                      }}
                      onChange={(e: any) => {
                        if (e.target.files.length === 0) return;
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        setLocationDialogOpen(true);
                      }}
                      className="absolute left-0 top-0 h-full w-full cursor-pointer bg-red-300 opacity-0"
                      type="file"
                      multiple={false}
                    />
                    <div className=" flex w-[240px] cursor-pointer flex-col items-center gap-[10px]">
                      <span
                        className={`h-[24px] w-[24px] text-xl text-primary-600`}
                      >
                        <TbCloudDownload />
                      </span>
                      <p className="text-center text-[13px] font-normal text-neutral-500">
                        Browse and choose the file you want to import from your
                        device
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {userData?.permissions?.includes(PERMISSIONS.CREATE_SEMESTER) && (
                <div className="space-y-2">
                  <h1>Import Semesters</h1>
                  <div className="relative flex h-[105px] w-full items-center justify-center rounded-[4px] border border-dashed border-[#D0D5DD] bg-primary-50">
                    <input
                      onClick={(e) => {
                        //@ts-ignore
                        e.target.file = [];
                        //@ts-ignore
                        e.target.value = "";
                      }}
                      onChange={(e: any) => {
                        if (e.target.files.length === 0) return;
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        setSemesterDialogOpen(true);
                      }}
                      className="absolute left-0 top-0 h-full w-full cursor-pointer bg-red-300 opacity-0"
                      type="file"
                      multiple={false}
                    />
                    <div className=" flex w-[240px] cursor-pointer flex-col items-center gap-[10px]">
                      <span
                        className={`h-[24px] w-[24px] text-xl text-primary-600`}
                      >
                        <TbCloudDownload />
                      </span>
                      <p className="text-center text-[13px] font-normal text-neutral-500">
                        Browse and choose the file you want to import from your
                        device
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div
                className="relative flex h-[105px] w-full items-center justify-center rounded-[4px] border border-dashed border-[#D0D5DD] bg-primary-50 "
                onClick={() => {
                  if (currentTab === "import") {
                    return;
                  }
                  setEventDialogOpen(true);
                }}
              >
                <div className=" flex w-[240px] cursor-pointer flex-col items-center gap-[10px]">
                  <span
                    className={`h-[24px] w-[24px] text-xl text-primary-600`}
                  >
                    <TbCloudUpload></TbCloudUpload>
                  </span>
                  <p className="text-center text-[13px] font-normal text-neutral-500">
                    Browse and choose the file you want to export from your
                    device
                  </p>
                </div>
              </div>
            </>
          )}
          {/* <div
          className="relative flex h-[105px] w-full items-center justify-center rounded-[4px] border border-dashed border-[#D0D5DD] bg-primary-50 "
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
          {currentTab === "import" ? (
            <>
              <h1>Import Calendar</h1>
              <div className=" flex w-[240px] cursor-pointer flex-col items-center gap-[10px]">
                <span className={`h-[24px] w-[24px] text-xl text-primary-600`}>
                  {" "}
                  <TbCloudDownload></TbCloudDownload>
                </span>
                <p className="text-center text-[13px] font-normal text-neutral-500">
                  Browse and choose the file you want to import from your device
                </p>
              </div>
            </>
          ) : (
            <>
              <div className=" flex w-[240px] cursor-pointer flex-col items-center gap-[10px]">
                <span className={`h-[24px] w-[24px] text-xl text-primary-600`}>
                  <TbCloudUpload></TbCloudUpload>
                </span>
                <p className="text-center text-[13px] font-normal text-neutral-500">
                  Browse and choose the file you want to export from your device
                </p>
              </div>
            </>
          )}
        </div> */}
        </div>
      </div>
    </>
  );
}
