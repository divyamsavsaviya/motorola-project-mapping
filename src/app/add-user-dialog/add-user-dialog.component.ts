import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { EmployeeDataService } from '../services/employee-data.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  actionTitle: string = 'Add User';
  actionBtn: string = "Add";
  showPassword: boolean = false;
  disableEmail: boolean = false;
  hide: boolean = true;
  disable: boolean = true;
  id: any;
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeDataService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private router: Router,
    private dialogRef: MatDialogRef<AddUserDialogComponent>) { }

  addUserForm !: FormGroup;

  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });

    if (this.editData) {
      this.id = this.editData.id;
      this.showPassword = true;
      this.disableEmail = true;
      this.actionTitle = "Update User";
      this.actionBtn = "Update";
      // this.addUserForm.controls['id'].disable();
      // this.addUserForm.controls['id'].setValue(this.editData.id);
      this.addUserForm.controls['email'].setValue(this.editData.email);
      this.addUserForm.controls['email'].disable();
      this.addUserForm.controls['password'].disable();
      this.addUserForm.controls['name'].setValue(this.editData.name);
      this.addUserForm.controls['name'].disable();
      this.addUserForm.controls['role'].setValue(this.editData.role);
    }
  }

  roles: String[] = [
    "Admin",
    "Editor",
    "Viewer"
  ];

  teams: String[] = [
    "Team 1",
    "Team 2",
    "Team 3"
  ];

  addUser() {
    console.log(this.addUserForm.value);
    if (!this.editData) {
      if (this.addUserForm.valid) {
        const { name, email, role, password } = this.addUserForm.value;
        this.employeeService.addEmployee({ name, email, role, password }).subscribe({
          next: (res) => {
            console.log("Added Successfully");
            this.dialogRef.close('add');
            console.log(res.message);
          },
          error: (error) => {
            console.log(error.message);
            if(error.status === 401) {
              this.router.navigate(['/login'])
            }
          }
        });
      }
    } else {
      this.updateUserRole();
    }
  }

  updateUserRole() {
    const id = this.id;
    const role = this.addUserForm.controls['role'].value;
    console.log(id, role);
    this.employeeService.updateEmployeeRole({ id, role }).subscribe({
      next: (res) => {
        this.addUserForm.reset();
        this.dialogRef.close('update');
        console.log(res.message);
      },
      error: (error) => {
        if(error.status === 401) {
          this.router.navigate(['/login'])
        }
      }
    })
  }
}

