import { parse } from '@fast-csv/parse';
import fs from 'fs';

export const CSVToJson = (csvFilepath: string) => {
  return new Promise<any[]>((resolve, reject) => {
    const listData: any[] = [];
    const fileStream = fs.createReadStream(csvFilepath);
  
    const stream = parse({ headers: true, delimiter: ';' })
        .on('data', (row: any) => listData.push(row))
        .on('end', () => resolve(listData))
        .on('error', () => reject('error'));
  
    fileStream.pipe(stream);
  });
}