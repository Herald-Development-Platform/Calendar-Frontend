const PERMISSIONS = {
  // Bulk import users, delete and update users
  CREATE_USER: "CREATE_USER",
  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",

  // Departments management
  CREATE_DEPARTMENT: "CREATE_DEPARTMENT",
  UPDATE_DEPARTMENT: "UPDATE_DEPARTMENT",
  DELETE_DEPARTMENT: "DELETE_DEPARTMENT",
  MANAGE_DEPARTMENT_REQUEST: "MANAGE_DEPARTMENT_REQUEST",

  // Event management
  VIEW_EVENTS_FOR_ALL_DEPARTMENT: "VIEW_EVENTS_FOR_ALL_DEPARTMENT",

  //Semester Permission
  CREATE_SEMESTER: "CREATE_SEMESTER",
  UPDATE_SEMESTER: "UPDATE_SEMESTER",
  DELETE_SEMESTER: "DELETE_SEMESTER",

  //Location Permissions
  CREATE_LOCATION: "CREATE_LOCATION",
  DELETE_LOCATION: "DELETE_LOCATION",
};

const READABLE_PERMISSIONS = {
  // Bulk import users, delete and update users
  CREATE_USER: "Add Users to the system",
  UPDATE_USER: "Update user roles",
  DELETE_USER: "Remove users",

  // Departments management
  CREATE_DEPARTMENT: "Add Departments",
  UPDATE_DEPARTMENT: "Update department details",
  DELETE_DEPARTMENT: "Delete department",
  MANAGE_DEPARTMENT_REQUEST: "Manage department requests",

  // Event management
  VIEW_EVENTS_FOR_ALL_DEPARTMENT: "Access events of all departments",

  //Semester Permission
  CREATE_SEMESTER: "Add Semester",
  UPDATE_SEMESTER: "Update Semester Details",
  DELETE_SEMESTER: "Delete Semester",

  //Location Permissions
  CREATE_LOCATION: "Add location shortcut",
  DELETE_LOCATION: "Remove location shortcut",
};

const PERMISSION_GROUPS = {
  "User permissions": [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.DELETE_USER,
  ],
  "Department permissions": [
    PERMISSIONS.CREATE_DEPARTMENT,
    PERMISSIONS.UPDATE_DEPARTMENT,
    PERMISSIONS.DELETE_DEPARTMENT,
    PERMISSIONS.MANAGE_DEPARTMENT_REQUEST,
  ],
  "Event permissions": [PERMISSIONS.VIEW_EVENTS_FOR_ALL_DEPARTMENT],
};

export { PERMISSIONS, READABLE_PERMISSIONS, PERMISSION_GROUPS };
