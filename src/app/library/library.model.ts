export interface Library {
  name: string;
  author: { [key: string]: string };
  description: string;
  homepage: string;
  bugs: Object;
  contributors: Array<Object>;
  distTags: Object;
  keywords: Array<string>;
  license: string;
  maintainers: Array<Object>;
  readme: string;
  repository: { directory: string; type: string; url: string };
  time: { [key: string]: string };
  users: Object;
  versions: Object;
  _id: string;
  _rev: string;
}

export interface DataTable {
  date: string;
  version: string;
}
