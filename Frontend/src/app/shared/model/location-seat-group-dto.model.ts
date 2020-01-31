import {EventSeatGroupDTO} from './event-seat-group-dto.model';
import {Serializable, Serialize, SerializeProperty} from 'ts-serializer';

@Serialize({})
export class LocationSeatGroupDTO extends Serializable {
  @SerializeProperty({
    map: 'eventID'
  })
  private _eventID: number;
  @SerializeProperty({
    map: 'locationID'
  })
  private _locationID: number;
  @SerializeProperty({
    map: 'eventSeatGroups'
  })
  private _eventSeatGroups: EventSeatGroupDTO[];

  constructor(eventID: number, locationID: number, eventSeatGroups: EventSeatGroupDTO[]) {
    super();
    this._eventID = eventID;
    this._locationID = locationID;
    this._eventSeatGroups = eventSeatGroups;
  }

  get eventID(): number {
    return this._eventID;
  }

  set eventID(eventID: number) {
    this._eventID = eventID;
  }

  get locationID(): number {
    return this._locationID;
  }

  set locationID(locationID: number) {
    this._locationID = locationID;
  }

  get eventSeatGroups(): EventSeatGroupDTO[] {
    return this._eventSeatGroups;
  }

  set eventSeatGroups(eventSeatGroups: EventSeatGroupDTO[]) {
    this._eventSeatGroups = eventSeatGroups;
  }
}