import { ITask } from "./task.types";

export interface ITaskColumnBase {
  _id: string;
  title: string;
  position: number;
  isArchived: boolean;
  createdAt: string;
}

export type ITaskColumnForm = Pick<ITaskColumnBase, "title"> & {
  _id?: ITaskColumnBase["_id"];
};
