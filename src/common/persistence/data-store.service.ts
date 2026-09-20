import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

export interface Place {
  id: string;
  [key: string]: any;
}

export interface Review {
  id: string;
  placeId: string;
  [key: string]: any;
}

export interface DataStore {
  places: Place[];
  reviews: Review[];
}

@Injectable()
export class DataStoreService {
  private readonly filePath: string;

  constructor(private readonly configService: ConfigService) {
    this.filePath = this.configService.getOrThrow<string>('DATA_FILE_PATH');
  }

  async read(): Promise<DataStore> {
    let raw: string;
    try {
      raw = await readFile(this.filePath, 'utf-8');
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        const initial: DataStore = { places: [], reviews: [] };
        await this.write(initial);
        return initial;
      }
      throw err;
    }

    try {
      return JSON.parse(raw) as DataStore;
    } catch {
      throw new InternalServerErrorException(
        'Le fichier de donnees est corrompu (JSON invalide).',
      );
    }
  }

  async write(data: DataStore) {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
