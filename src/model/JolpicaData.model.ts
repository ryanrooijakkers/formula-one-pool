export class JolpicaDataModel {
  MRData: MRData = new MRData();
}

export class MRData {
  RaceTable: RaceTable = new RaceTable();
  DriverTable: DriverTable = new DriverTable();
}

export class RaceTable {
  Races: RaceModel[] = [];
  Results: Result[] = [];
}

export class DriverTable {
  Drivers: Driver[] = [];
}

export class RaceModel {
  raceName: string = '';
  season: string = '';
  round: string = '';
  date: string = '';
  Circuit: Circuit = new Circuit();
}

export class Result {
  position: string = '';
  Driver: Driver = new Driver();
  FastestLap: FastestLap = new FastestLap();
}

export class Driver {
  driverId: string = '';
  season: number = 0;
  givenName: string = '';
  familyName: string = '';
}

export class FastestLap {
  rank: string = '';
}

export class Circuit {
  circuitName: string = '';
  Location: Location = new Location();
}

export class Location {
  country: string = '';
}
