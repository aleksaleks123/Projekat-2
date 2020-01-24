import {Component, Input, OnInit} from '@angular/core';
import {SeatGroup} from '../shared/model/seat-group.model';
import Konva from 'konva';

@Component({
  selector: 'app-seat-groups',
  templateUrl: './seat-groups.component.html',
  styleUrls: ['./seat-groups.component.scss']
})
export class SeatGroupsComponent implements OnInit {
  @Input() private seatGroups: SeatGroup[];
  @Input() private width: number;
  @Input() private height: number;

  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private seatGroupRepresentations: Konva.Group[] = [];
  private transformersMap = new Map<Konva.Group, Konva.Transformer>();

  constructor() {
  }

  ngOnInit(): void {
    this.setUpStage();
    this.layer = new Konva.Layer();
    this.setUpSeatGroups();
    this.stage.add(this.layer);
  }

  setUpStage() {
    this.stage = new Konva.Stage({
      container: 'konva',
      width: this.width,
      height: this.height,
      draggable: true
    });

    this.stage.on('dragstart', () => {
      this.stage.container().style.cursor = 'move';
    });

    this.stage.on('dragend', () => {
      this.stage.container().style.cursor = 'default';
    });

    this.stage.on('dblclick', (e) => {
      if (e.target.getType() === 'Stage') {
        this.transformersMap.forEach((value) => {
          value.detach();
        });
        e.target.draw();
      }
    });
  }

  setUpSeatGroups() {
    for (const seatGroup of this.seatGroups) {
      const seatGroupRepresentation = this.setUpSeatGroup(seatGroup);
      this.setUpSeatsOrParterre(seatGroup, seatGroupRepresentation);
      this.seatGroupRepresentations.push(seatGroupRepresentation);
      this.layer.add(seatGroupRepresentation);
    }
  }

  setUpRotationSnaps(seatGroup) {
    return new Konva.Transformer({
      node: seatGroup,
      centeredScaling: true,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: false
    });
  }

  setUpSeatGroup(seatGroup: SeatGroup): Konva.Group {
    const seatGroupRepresentation = new Konva.Group({
      x: this.stage.getPosition().x + seatGroup.xCoordinate,
      y: this.stage.getPosition().y + seatGroup.yCoordinate,
      rotation: seatGroup.angle,
      draggable: true,
      id: seatGroup.id.toString()
    });

    seatGroupRepresentation.on('dragstart', () => {
      this.stage.container().style.cursor = 'pointer';
    });

    seatGroupRepresentation.on('dragend', () => {
      this.stage.container().style.cursor = 'default';
    });

    seatGroupRepresentation.on('dblclick', () => {
      if (!this.transformersMap.has(seatGroupRepresentation)) {
        const rotationSnap = this.setUpRotationSnaps(seatGroupRepresentation);
        this.transformersMap.set(seatGroupRepresentation, rotationSnap);
        this.layer.add(rotationSnap);
      } else {
        this.transformersMap.get(seatGroupRepresentation).attachTo(seatGroupRepresentation);
      }
      this.layer.draw();
    });

    return seatGroupRepresentation;
  }

  setUpSeatsOrParterre(seatGroup: SeatGroup, seatGroupRepresentation: Konva.Group) {
    if (seatGroup.parterre) {
      const text = new Konva.Text({
        x: seatGroupRepresentation.getPosition().x,
        y: seatGroupRepresentation.getPosition().y,
        text: seatGroup.name,
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#555',
        width: 200,
        padding: 20,
        align: 'center'
      });
      seatGroupRepresentation.add(text);
      seatGroupRepresentation.add(new Konva.Rect({
        x: seatGroupRepresentation.getPosition().x,
        y: seatGroupRepresentation.getPosition().y,
        stroke: '#555',
        strokeWidth: 5,
        width: text.width(),
        height: text.height(),
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.2,
        cornerRadius: 5
      }));
    } else {
      seatGroupRepresentation.add(new Konva.Text({
        x: 0,
        y: seatGroup.rowsNum * 35,
        text: seatGroup.name,
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#555',
        width: seatGroup.colsNum * 30,
        align: 'center',
        padding: 5,
      }));
      for (let i = 0; i < seatGroup.colsNum; i++) {
        for (let j = 0; j < seatGroup.rowsNum; j++) {
          seatGroupRepresentation.add(new Konva.Rect({
            x: i * 35,
            y: j * 35,
            width: 30,
            height: 30,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 1,
            cornerRadius: 5
          }));
        }
      }
    }
  }
}
