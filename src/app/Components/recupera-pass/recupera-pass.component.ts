import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-recupera-pass',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule],
  templateUrl: './recupera-pass.component.html',
  styleUrl: './recupera-pass.component.css'
})
export class RecuperaPassComponent {
  formularioRpass!: FormGroup;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.formularioRpass = new FormGroup({
      mail: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
    });
  }

  recuperar(): void {
    if (this.formularioRpass.valid) {

      const login = {
        mail: this.formularioRpass.get('mail')?.value,
      };
      // const rPass = this.servicioReg.recuperaPass(login.mail
      // );
      // if (rPass !== '') {
      //   console.log('Enviar mail con la pass:', { rPass });
      //   this.router.navigate(['/login']);
      // }
    }
  }
}
