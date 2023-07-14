import { Injectable } from '@angular/core';

import { LibraryService } from './library.service';

@Injectable()
export class LibraryVersionService {
    constructor(private libService: LibraryService){}

    this.libService.libInfo.pipe(take(1)).subscribe({
      next: (data) => {
        this.lib = data;
        this.libName = data.name;
        this.libGithub = data.homepage;
        this.libNpm = `https://www.npmjs.com/package/${data._id}`;
        let currentVersion = Object.keys(data.versions)[
          Object.keys(data.versions).length - 1
        ];
        if (currentVersion.charAt(0) == '0') {
          currentVersion = Object.keys(data.versions)[
            Object.keys(data.versions).length - 2
          ];
        }
        this.libCurrentVersion = currentVersion;

        for (const key in data.time) {
          this.libVersion.push({
            date: data.time[key].slice(-data.time[key].length, 10),
            version: key,
          });
        }

        this.libVersion = this.libVersion.slice(2);

        this.dataSource.data = this.libVersion;
      },
    });
}
