"use client";
import React, { useEffect, useState } from "react";
import * as Headers from "@/components/Header";
import RecentSearches from "@/components/RecentSearches/RecentSearches";
import { Axios } from "@/services/baseUrl";
import { useQuery } from "@tanstack/react-query";

interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
}

export default function Page() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({});

  const { data } = useQuery({
    queryKey: ["Departments"],
    queryFn: () => Axios.get("/department/request"),
  });
  console.log("data", data.data);
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await Axios.get(`/department`);
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Axios.post(`/department`, newDepartment);
      setNewDepartment({});
      fetchDepartments();
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await Axios.delete(`/api/department/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };
  return (
    <div className="flex flex-col gap-9">
      <Headers.DepartmentHeader />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold">Add New Department</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="mb-2 block font-bold">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newDepartment.name || ""}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="code" className="mb-2 block font-bold">
                Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={newDepartment.code || ""}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="mb-2 block font-bold">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newDepartment.description || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
            >
              Add Department
            </button>
          </form>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div>asdfsadfsf</div>
          <h2 className="mb-4 text-xl font-bold">View Departments</h2>
          <ul>
            {departments.map((department) => (
              <li
                key={department._id}
                className="mb-2 flex items-center justify-between rounded-md bg-gray-100 p-4"
              >
                <div>
                  <h3 className="font-bold">{department.name}</h3>
                  <p>Code: {department.code}</p>
                  <p>{department.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(department._id)}
                  className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
