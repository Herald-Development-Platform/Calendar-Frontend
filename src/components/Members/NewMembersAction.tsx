"use client"

import { Axios } from '@/services/baseUrl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';

const NewMembersAction = ({actionId}:{actionId: string}) => {
    const queryClient = useQueryClient();

    const { mutate: approveUser, isPending: approvingUser } = useMutation({
        mutationFn: (payload: any) =>
          Axios.put(`/department/request/${payload?._id}`, {
            status: payload?.status,
          }),
        onSuccess: async (response: any) => {
          if (response.status >= 400 && response.status < 500) {
            toast.error(
              response?.data?.message ||
                response?.data?.error ||
                "Error process request!",
            );
            return;
          } else {
            toast.success(
              `User ${
                response.data?.data?.request?.status === "APPROVED"
                  ? "approved successfully"
                  : "rejected"
              }`,
            );
          }
          queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
          queryClient.invalidateQueries({ queryKey: ["UnapprovedUsers"] });
        },
      });

      const { mutate: rejectUser, isPending: rejectingUser } = useMutation({
        mutationFn: (payload: any) =>
          Axios.put(`/department/request/${payload?._id}`, {
            status: payload?.status,
          }),
        onSuccess: async (response: any) => {
          if (response.status >= 400 && response.status < 500) {
            toast.error(
              response?.data?.message ||
                response?.data?.error ||
                "Error process request!",
            );
            return;
          } else {
            toast.success(
              `User ${
                response.data?.data?.request?.status === "APPROVED"
                  ? "approved successfully"
                  : "rejected"
              }`,
            );
          }
          queryClient.invalidateQueries({ queryKey: ["AllUsers"] });
          queryClient.invalidateQueries({ queryKey: ["UnapprovedUsers"] });
        },
      });

      
  return (
    <div className=" flex h-8 flex-row gap-4 ">
                      <button
                        className=" text-500 flex items-center gap-2 justify-center rounded-md bg-success-500 px-4 py-2 text-[13px] text-white"
                        onClick={() => {
                          approveUser({ _id: actionId, status: "APPROVED" });
                        }}
                      >
                        Approve {approvingUser && <LoaderCircle size={19} className="animate-spin" />}
                      </button>
                      <button
                        className="text-500 flex items-center gap-2 justify-center rounded-md bg-danger-500 px-4 py-2 text-[13px] text-white"
                        onClick={() => {
                          rejectUser({ _id: actionId, status: "REJECTED" });
                        }}
                      >
                        Deny {rejectingUser && <LoaderCircle size={19} className="animate-spin" />}
                      </button>
                    </div>
  )
}

export default NewMembersAction