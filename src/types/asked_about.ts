import type { Tables } from "./types";

type AskedAboutTable = Tables["Asked_About"];

export type AskedAbout = AskedAboutTable["Row"];

export type AskedAboutInsert = AskedAboutTable["Insert"];

export type AskedAboutUpdate = AskedAboutTable["Update"];
