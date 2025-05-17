export type TUser = {
  id: string;
  name: string;
  login: string;
  time: string;
};

export type TUniqueUser = {
  quetion?: string;
  region?: string | null;
} & TUser;
