import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  constructor(protected http: HttpClient) {
  }

  importOfflineData<I>(collectionName: string): Promise<I[]> {
    return new Promise<I[]>(resolve => {
      this.http.get(`assets/data/${ collectionName }.json`).subscribe((data) => {
        resolve(data as I[]);
      })
    })
  }

  writeOfflineData<I>(collectionName: string, documents: I[]) {
    //return writeJsonFile(`assets/data/${ collectionName }.json`, documents);
  }
}
