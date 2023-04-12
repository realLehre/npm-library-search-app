export interface Library {
  name: String;
  author: Object;
  description: String;
  homepage: String;
  bugs: Object;
  contributors: Array<Object>;
  distTags: Object;
  keywords: Array<String>;
  license: String;
  maintainers: Array<Object>;
  readme: String;
  repository: Object;
  time: { [key: string]: string };
  users: Object;
  versions: Object;
  _id: String;
  _rev: String;
}
