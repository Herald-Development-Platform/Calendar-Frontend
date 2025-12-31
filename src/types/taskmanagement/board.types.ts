export type TBoardData = {
  _id: string;
  name: string;
  description: string;
  color: string;
  invitedMembers: {
    _id: string;
    fullName: string;
    email: string;
    profile: string;
  }[];
};

export type TBoardFormData = Pick<TBoardData, "name" | "description" | "color"> & {
  _id?: TBoardData["_id"];
};
