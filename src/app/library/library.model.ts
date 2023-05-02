export interface Library {
  name: string;
  author: Object;
  description: string;
  homepage: string;
  bugs: Object;
  contributors: Array<Object>;
  distTags: Object;
  keywords: Array<string>;
  license: string;
  maintainers: Array<Object>;
  readme: string;
  repository: Object;
  time: { [key: string]: string };
  users: Object;
  versions: Object;
  _id: string;
  _rev: string;
}
