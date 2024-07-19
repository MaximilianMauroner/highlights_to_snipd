import { readFileSync } from "fs";

const bookmarkFile = "file.json";

const parts = ["00:15", "12:50", "10:20"];

const getFileJSON = () => {
  const map = new Map();
  // const partsValues = new Map();
  const data = readFileSync(bookmarkFile, "utf-8");
  const jason = JSON.parse(data);
  for (const val of jason.records) {
    if (!map.has(val.Start)) {
      map.set(val.Start, val);
    }
  }
  const records: number[] = [];
  map.forEach((e) => records.push(hmsToSec(e.Start)));

  records.sort((a, b) => a - b);
  const partStack: number[] = [];
  let startSec = 0;
  partStack.push(startSec);
  for (const time of parts) {
    startSec += minsecToSec(time);
    partStack.push(startSec);
  }
  let i = 0;
  let j = 0;

  while (j < records.length && i < partStack.length) {
    const rj = records[j];
    const pi = partStack[i];

    if (pi !== undefined && rj !== undefined) {
      if (pi < rj && i + 1 < partStack.length) {
        i++;
        continue;
      } else {
        j++;
      }
      console.log(
        `Part: ${i} - has highlight - ${j} - time: ${secToMinSec(rj)}`
      );
    }
  }

  // console.log(map);
};

const secToMinSec = (val: number) => {
  const value = Math.floor(val);
  return `${Math.floor(value / 60)}:${value % 60}`;
};

const minsecToSec = (val: string) => {
  const [min, sec] = val.split(":");
  return +(min ?? 0) * 60 + +(sec ?? 0);
};

const hmsToSec = (val: string) => {
  const [h, m, s] = val.split(":");
  return +(h ?? 0) * 60 * 60 + +(m ?? 0) * 60 + +(s ?? 0);
};
getFileJSON();
