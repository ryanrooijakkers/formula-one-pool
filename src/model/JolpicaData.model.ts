export class JolpicaDataModel {
  MRData: MRData = new MRData();
}

export class MRData {
  RaceTable: RaceTable = new RaceTable();
}

export class RaceTable {
  Races: RaceModel[] = [];
  Results: Result[] = [];
}

export class RaceModel {
  raceName: string = '';
  season: string = '';
  round: string = '';
  date: string = '';
}

export class Result {
  position: string = '';
  Driver: Driver = new Driver();
  FastestLap: FastestLap = new FastestLap();
}

export class Driver {
  givenName: string = '';
  familyName: string = '';
}

export class FastestLap {
  rank: string = '';
}
