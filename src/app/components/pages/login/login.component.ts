import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: string = '';

  constructor(private userService: UserService, private router: Router) {
    this.form = new FormGroup({
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string>('', [
        Validators.required,
      ]),
    });

    if (process.env['APP_AUTO_LOGIN'] && process.env['APP_AUTO_PASSWORD']) {
      this.form.setValue({
        email: process.env['APP_AUTO_LOGIN'],
        password: process.env['APP_AUTO_PASSWORD']
      })
    }
  }

  get email(): FormControl<string> {
    return this.form.get('email') as FormControl<string>;
  }

  get password(): FormControl<string> {
    return this.form.get('password') as FormControl<string>;
  }

  ngOnInit(): void {

  }

  async handleSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        await this.userService.login(this.form.value.email, this.form.value.password);
        await this.router.navigate([ '/', 'home' ]);
      } catch (error) {
        this.error = (error as Error).message;
      }
    }
  }
}
