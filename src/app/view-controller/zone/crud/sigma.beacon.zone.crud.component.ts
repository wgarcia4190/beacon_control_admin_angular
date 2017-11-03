import {
   AfterViewInit,
   Component,
   ElementRef,
   OnDestroy,
   OnInit,
   Renderer2,
   ViewChild,
   ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subscription } from 'rxjs/Rx';
import { setTimeout } from 'timers';

import { Beacon } from '../../../model/entities/beacon';
import { Zone } from '../../../model/entities/zone';
import { SigmaZoneService } from '../../../model/services/sigma.zone.service';
import { SigmaBeaconUtility } from '../../../utils/sigma.beacon.utility';
import { SigmaBeaconModalDialogComponent } from '../../components/sigma.beacon.modal.dialog.component';

declare const jQuery: any;

@Component({
      selector: 'sigma-beacon-crud-zone',
      encapsulation: ViewEncapsulation.None,
      templateUrl: './sigma.beacon.zone.crud.component.html',
      styleUrls: [
            '../../../../assets/resources/css/sigma.beacon.general.scss',
            '../../../../assets/resources/css/sigma.beacon.crud.zone.scss'
      ]
})
export class SigmaBeaconZoneCrudComponent implements AfterViewInit, OnInit, OnDestroy {
      private isEdit: boolean = false;
      private zone: Zone = new Zone();;
      private urlSubscription: Subscription;
      private validForm: FormGroup;
      private beacons: Array<Beacon> = new Array<Beacon>();

      @ViewChild('colorButton') private colorButton: ElementRef;
      @ViewChild('zoneName') private zoneNameInput: ElementRef;
      @ViewChild('beaconSelectContainer') private beaconSelectContainer: ElementRef;

      constructor(private beaconUtility: SigmaBeaconUtility, private zoneService: SigmaZoneService,
            private renderer: Renderer2, private route: Router, private dialogService: DialogService,
            router: ActivatedRoute, formBuilder: FormBuilder) {
            this.isEdit = router.snapshot.data['editable'];

            this.validForm = formBuilder.group({
                  'zoneName': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
                  'zoneDescription': [null]
            });

            if (this.isEdit) {
                  this.urlSubscription = router.params.subscribe(params => {
                        this.beaconUtility.mainComponent.busy = this.zoneService.getZoneById(params['id']).subscribe(zone => {
                              this.zone.fromJson(JSON.parse(zone.data));
                              const controls = this.validForm.controls;

                              controls['zoneName'].setValue(this.zone.name, { emitEvent: false });
                              controls['zoneDescription'].setValue(this.zone.description, { emitEvent: false });
                              this.renderer.setStyle(this.colorButton.nativeElement, 'background-color', this.zone.color);
                              this.renderer.setStyle(this.zoneNameInput.nativeElement, 'border-left-color', this.zone.color);

                              this.beaconUtility.mainComponent.busy.unsubscribe();
                        });
                  });
            }
      }

      public ngOnInit(): void {
            this.beaconUtility.mainComponent.busy = this.zoneService.getBeaconsWithoutZone().subscribe(beacons => {
                  const beaconsJson = JSON.parse(beacons.data);
                  for (const beaconJson of beaconsJson) {
                        const beacon: Beacon = new Beacon();
                        beacon.fromJson(beaconJson);

                        this.beacons.push(beacon);
                  }
                  this.beaconUtility.mainComponent.busy.unsubscribe();

                  setTimeout(() => {
                        this.renderer.setStyle(this.beaconSelectContainer.nativeElement, 'visibility', 'visible');
                        jQuery('.selectpicker').selectpicker();
                  }, 50);
            });
      }

      public ngAfterViewInit(): void {
            jQuery('#zone_color').spectrum({
                  color: "#7e53c5",
                  showPalette: true,
                  showPaletteOnly: true,
                  showSelectionPalette: true,
                  preferredFormat: "hex",
                  palette: [
                        ["rgb(5, 121, 111)", "rgb(25, 166, 154)", "rgb(99, 188, 102)", "rgb(155, 205, 95)",
                              "rgb(255, 168, 0)", "rgb(255, 203, 0)", "rgb(255, 240, 72)", "rgb(212, 227, 74)",
                              "rgb(255, 111, 58)", "rgb(242, 81, 75)", "rgb(239, 60, 121)", "rgb(172, 65, 190)",
                              "rgb(126, 83, 197)", "rgb(91, 105, 195)", "rgb(59, 75, 178)", "rgb(34, 44, 111)"]
                  ],
                  change: (color: any) => {

                        const hexColor = color.toHexString();
                        this.renderer.setStyle(this.colorButton.nativeElement, 'background-color', hexColor);
                        this.renderer.setStyle(this.zoneNameInput.nativeElement, 'border-left-color', hexColor);

                        jQuery(".sp-container").toggleClass("sp-hidden");
                  }
            });

            this.beaconUtility.breadcrumbEmitter.emit([{
                  'isLeaf': false,
                  'value': 'Zones',
                  'routes': ['zones', 'list']
            }, {
                  'isLeaf': true,
                  'value': !this.isEdit ? 'Add Zone' : 'Edit Zone'
            }]);
      }

      private toggleColorPicker(event: any): void {
            const left = event.x - event.offsetX;
            jQuery(".sp-container").css("left", left).toggleClass("sp-hidden");
      }

      private addBeaconToZone(beaconId: any): void {
            let count = 0;
            for (; count < this.beacons.length; count++) {
                  if (this.beacons[count].id == beaconId)
                        break;
                  else
                        continue;
            }

            const beaconToAdd = this.beacons.splice(count, 1)[0];
            this.zone.addBeacon(beaconToAdd);

            jQuery('.selectpicker').selectpicker('destroy');
            setTimeout(() => jQuery('.select').addClass('selectpicker').selectpicker(), 1);
      }

      private removeBeaconFromZone(event: any, beaconId: number): void {
            let count = 0;
            for (; count < this.zone.beacons.length; count++) {
                  if (this.zone.beacons[count].id === beaconId)
                        break;
                  else
                        continue;
            }

            const beaconToRemove = this.zone.removeBeacon(count);
            this.beacons.push(beaconToRemove);

            jQuery('.selectpicker').selectpicker('destroy');
            setTimeout(() => jQuery('.select').addClass('selectpicker').selectpicker(), 1);
            event.stopPropagation();
      }

      private saveZone(zoneName: string, zoneDescription: string): void {
            const zoneColor = window.getComputedStyle(this.colorButton.nativeElement).backgroundColor;
            if (!this.validForm.invalid) {
                  this.zone.name = zoneName;
                  this.zone.description = zoneDescription;
                  this.zone.color = zoneColor;

                  this.beaconUtility.mainComponent.busy = this.zoneService.saveZone(this.zone, this.isEdit).subscribe((data) => {
                        if (data.code === 200) {
                              this.route.navigate(['/app', 'zones', 'list']);
                        }
                  }, (error) => {
                        console.log(error);
                  });
            }
      }

      private deleteZone(): void {
            let disposable = this.dialogService.addDialog(SigmaBeaconModalDialogComponent, {
                  title: 'Warning!',
                  message: 'Are you sure you want to delete zone?',
                  bottonText: 'Delete',
                  bottonClass: 'btn btn-danger btn-action-delete btn-static-width with-modal'
            }).subscribe((isConfirmed) => {
                  if (isConfirmed) {
                        this.zoneService.deleteZone(this.zone.id).subscribe(data => {
                              if (data.code === 200) {
                                    this.route.navigate(['/app', 'zones', 'list']);
                              }
                        }, (error) => {
                              console.log(error);
                        });
                  }
            });
      }

      public ngOnDestroy(): void {
            if (this.urlSubscription) {
                  this.urlSubscription.unsubscribe();
            }
      }
}
