
export interface ITaskColumnBase {
  _id: string;
  title: string;
  position: number;
  isArchived: boolean;
  createdAt: string;
  board: string;
}

export type ITaskColumnForm = Pick<ITaskColumnBase, "title" | "board"> & {
  _id?: ITaskColumnBase["_id"];
};
