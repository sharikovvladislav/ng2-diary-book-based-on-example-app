import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DiaryEntry } from '../models/diary-entry';
import { DiaryEntrySet } from '../models/diary-entry-set';
import { DiaryProcessorService } from './diary-processor';
import { HttpClient } from '@angular/common/http';
import { RemoteList } from '../models/remote-list';
import { environment } from '../../environments/environment';


@Injectable()
export class DiaryEntryService {
  private API_PATH = '/diaryEntries';
  private list$: FirebaseListObservable<{}>;
  private API_REST_URL = environment.firebase.restURL;

  constructor(
    private db: AngularFireDatabase,
    private diaryProcessor: DiaryProcessorService,
    private http: HttpClient,
  ) {
    this.list$ = this.db.list(this.API_PATH);
  }

  retrieveEntries(uid: string): Observable<DiaryEntry[]> {
    return this.http.get(`${this.API_REST_URL}diaryEntries`) ///app/diaryEntries
      .map((diaryEntries: RemoteList) => diaryEntries.items);
  }

  createEntry(uid: string, entryData: DiaryEntrySet): Observable<DiaryEntry> {
    return new Observable(observer => {
      this.getDbRef(uid)
        .push(this.diaryProcessor.prepareForServerProcess(entryData))
        .then(() => {
          observer.next(entryData);
          observer.complete();
        });
    });
  }

  updateEntry(userId: string, entryData: DiaryEntrySet): Observable<DiaryEntry> {
    const itemKey = entryData.$key;

    return new Observable(observer => {
      this.getDbRef(userId)
        .update(itemKey, this.diaryProcessor.prepareForServerProcess(entryData))
        .then(() => {
          observer.next(entryData);
          observer.complete();
        });
    });
  }

  private getDbRef(uid: string, additionalParams = {}) {
    return this.db.list(`/${this.API_PATH}/${uid}`, additionalParams);
  }
}
