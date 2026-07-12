// ── Shared error shape ────────────────────────────────────────────────────

export interface EdgeFunctionError {
  message: string;
  status?: number;
  code?: string;
  name?: string;
}

// ── Request body types ────────────────────────────────────────────────────

export interface CreateUserRequest {
  email: string;
  password: string;
  displayname: string;
  isSupervisor: boolean;
  department_id: number;
}

export interface DeleteUserRequest {
  userId: string;
}

export type DeleteAllNonAdminUsersRequest = Record<string, never>;

export interface SendEmailRequest {
  to: string;
  from: string;
  subject: string;
  message: string;
  replyTo?: string; // ← NEW: optional
}

// ── Response types ────────────────────────────────────────────────────────

export interface CreateUserResponse {
  data: { user: { id: string; email: string; user_metadata: Record<string, unknown> } } | null;
  error: EdgeFunctionError | null;
}

export interface DeleteUserResponse {
  data: { message: string } | null;
  error: EdgeFunctionError | null;
}

export interface DeleteAllNonAdminUsersResponse {
  deletedUsersCount: number;
  skippedAdminCount: number;
  failedDeletes: {
    userId: string;
    error: EdgeFunctionError;
  }[];
}

export interface SendEmailResponse {
  data: { id: string } | null;
  error: EdgeFunctionError | null;
}

// ── Function map ──────────────────────────────────────────────────────────

export interface EdgeFunctionMap {
  createUser: {
    body: CreateUserRequest;
    response: CreateUserResponse;
  };
  deleteUser: {
    body: DeleteUserRequest;
    response: DeleteUserResponse;
  };
  deleteAllNonAdminUsers: {
    body: DeleteAllNonAdminUsersRequest;
    response: DeleteAllNonAdminUsersResponse;
  };
  sendEmail: {
    body: SendEmailRequest;
    response: SendEmailResponse;
  };
}