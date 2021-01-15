import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { async } from '@angular/core/testing';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  constructor() {}

async setObject(key, value) {
  await Storage.set({
    key,
    value: JSON.stringify(value)
  });
}

async getObject(key) {
  const ret = await Storage.get({ key });
  return JSON.parse(ret.value);
}

async setItem(key, value) {
  await Storage.set({
    key,
    value
  });
}

async getItem(key) {
  const { value } = await Storage.get({ key });
  return value;
}

async removeItem(key) {
  await Storage.remove({ key });
}

async clear() {
  await Storage.clear();
}
}
