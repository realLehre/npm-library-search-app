export interface LibraryDownloadInterface {
  downloads: { [key: string]: { downloads: number; day: string } };
  end: string;
  package: string;
  start: string;
}
