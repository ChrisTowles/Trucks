import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastService} from 'ng-uikit-pro-standard';
import deleteProperty = Reflect.deleteProperty;

@Component({
  selector: 'app-vin-tool',
  templateUrl: './vin-tool.component.html',
  styleUrls: ['./vin-tool.component.scss'],
})
export class VinToolComponent implements OnInit {

  vin: string;
  data: any;

  constructor(private http: HttpClient,
              private toast: ToastService) {
  }

  ngOnInit() {
  }


  lookupVin() {
    this.http.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${this.vin.trim()}?format=json`)
      .subscribe(data => {
        // Read the result field from the JSON response.
        if (data['Results'].length > 0) {
          this.data = data['Results'][0];

          // Remove empty fields
          for (const p of Object.keys(this.data)) {
            if (!this.data[p]) {
              deleteProperty(this.data, p);
            }
          }

        } else {
          this.toast.error('Error Finding vin information', 'Failed');
          this.data = data;
        }

      });
  }
}
