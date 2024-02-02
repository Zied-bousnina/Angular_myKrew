import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})

export class MissionComponent {
  userSelection: string = 'true';
  myForm: FormGroup;
  selectedFile: File | null = null;
  isSimulationValidated: string | null = null;

  constructor(private inscriptionservice: InscriptionService, private fb: FormBuilder, private router: Router) {

    this.myForm = this.fb.group({
      profession: ['', Validators.required],
      industrySector: ['', Validators.required],
      finalClient: ['', Validators.required],
      dailyRate: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isSimulationValidated: ['', Validators.required],
      // Add other form controls as needed
    });

  }

  ngOnInit(): void {

  }
  // Add this method inside your PreInscriptionComponent class
  areAllFieldsFilled(): boolean {
    const formValues = this.myForm.value;
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        const value = formValues[key];
        if (value === null || value === undefined || value === '') {
          return false; // At least one field is empty
        }
      }
    }
    return true; // All fields are filled
  }
  drivingLicense(event: any) {
    const fileInput = event.target.files[0];
    return fileInput

  }

  submit(): void {
    const token = localStorage.getItem('token');

    // Check if token is available
    if (token) {
      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);

      console.log('token', token);

      this.inscriptionservice.getMyPreRegister(headers).subscribe({
        next: (res: any) => {
          // Handle the response from the server
          console.log('Response from getMyPreRegister:', res);

          if (this.areAllFieldsFilled() == false) {
            this.myForm.markAllAsTouched();
            console.log('Fields not filled');
            return;
          } else {
            const formData = new FormData();
            formData.append('profession', this.myForm.value.profession);
            formData.append('industrySector', this.myForm.value.industrySector);
            formData.append('finalClient', this.myForm.value.finalClient);
            formData.append('dailyRate', this.myForm.value.dailyRate);
            formData.append('endDate', this.myForm.value.endDate);
            formData.append('startDate', this.myForm.value.startDate);

            const isSimulationValidatedeee = this.fileInputs.isSimulationValidated.files[0];
            formData.append('isSimulationValidated', isSimulationValidatedeee);

            console.log('missionKilled:', res?.missionInfo.missionKilled);

            if (res?.missionInfo.missionKilled == false) {
              console.log('if block entered');

              this.inscriptionservice.createinscrptionstep3(formData, headers).subscribe({
                next: (res) => {
                  // Handle the response from the server
                  console.log('Response from createinscrptionstep3:', res);
                  this.router.navigate(['/pending']);
                },
                error: (e) => {
                  // Handle errors
                  console.error('Error in createinscrptionstep3:', e);
                },
              });
            } else {
              console.log('else block entered');

              this.inscriptionservice.createinscrptionstep5(formData, headers).subscribe({
                next: (res) => {
                  // Handle the response from the server
                  console.log('Response from createinscrptionstep5:', res);
                  this.router.navigate(['/pending']);
                },
                error: (e) => {
                  // Handle errors
                  console.error('Error in createinscrptionstep5:', e);
                },
              });
            }
          }
        },
        error: (e) => {
          // Handle errors
          console.error('Error in getMyPreRegister:', e);
          // Set loading to false in case of an error
        },
      });
    }
  }

  // Assuming you have an object to hold file inputs
  fileInputs: any = {};

  setFileInput(field: string, event: any): void {
    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log(this.selectedFile);

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field === 'isSimulationValidated') {
          console.log(e.target!.result);
          this.isSimulationValidated = e.target!.result as string;
        }
      };

      // Read the file as a data URL
      reader.readAsDataURL(input.files[0]);
    }
  }

}
