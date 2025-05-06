import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiServiceService } from '../../Service/api-service.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

interface RegistroPerfil {
  perfilName: string;
  perfilCod: number;
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  formularioRegistro!: FormGroup;
  edadValida = false;
  resultado: boolean = false;
  showPassword = false;
  showRepeatPassword = false;
  StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  public perfiles: RegistroPerfil[] = [{ perfilName: 'Admin', perfilCod: 1 },
  { perfilName: 'Visita', perfilCod: 2 },
  { perfilName: 'Moderador', perfilCod: 3 }];

  constructor(
    private router: Router,
    private cookies: CookieService,
    private apiService: ApiServiceService,
    // private servicioReg: RegistroService,
    // private jsonPerfiles: PerfilService
  ) {
    this.formularioRegistro = new FormGroup({
      nombreUsuario: new FormControl('', [Validators.required, Validators.minLength(6)]),
      mail: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('', [Validators.required, this.passwordFormField]),
      repetirPassword: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required, this.dateValidator]),
      perfil: new FormControl('', [Validators.required])
    }
      , { validators: this.validaPassRepit }

    );

  }

  Perfiles: any[] = this.perfiles;

  ngOnInit(): void {
  }

  passwordFormField(control: AbstractControl): { [key: string]: boolean } | null {
    const pass = control?.value;
    if (!pass) {
      return null;
    }

    const UpperPattern = /^(?=.*[A-Z])/;
    if (!UpperPattern.test(pass)) {
      return { 'invalidMayuscula': true };
    }

    const LowerPattern = /(?=.*[a-z])/;
    if (!LowerPattern.test(pass)) {
      return { 'invalidMin': true };
    }

    const NumberPattern = /(.*[0-9].*)/;
    if (!NumberPattern.test(pass)) {
      return { 'invalidNum': true };
    }

    const CaracterPattern = /(?=.*[!@#$%^&*])/;
    if (!CaracterPattern.test(pass)) {
      return { 'invalidCaracter': true };
    }

    const LargoMinPattern = /.{8,10}/;
    if (!LargoMinPattern.test(pass)) {
      return { 'invalidLength': true };
    }

    return null;
  }

  validaPassRepit: ValidatorFn = (Control: AbstractControl): { [key: string]: boolean } | null => {
    const { password, repetirPassword } = Control.value;


    if (!password && !repetirPassword) {
      return null;
    }


    if (password != repetirPassword) {
      return { invalidPassRepit: true };
    }

    return null;
  }

  get passRepit() {
    const pass1 = this.formularioRegistro.get('password');
    const pass2 = this.formularioRegistro.get('repetirPassword');
    if (pass1?.value != pass2?.value) {
      return false;
    } else {
      return true;
    }
  }


  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const dateValue = control.value;
    if (!dateValue) {
      return null;
    }
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateValue)) {
      return { 'invalidDate': true };
    }
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return { 'invalidDate': true };
    }


    const cienAnios = 1000 * 60 * 60 * 24 * 36500;
    const endDate = new Date();
    const restaDate = endDate.getTime() - cienAnios;
    const startDate = new Date(restaDate);

    if (date < startDate || date > endDate) {
      return { 'invalidDate': true };
    }

    return null;
  }

  registrar() {
    if (this.formularioRegistro.valid) {
      const usuario = {
        nombre: "prueba",
        ap_paterno: "prueba",
        mail: this.formularioRegistro.get('mail')?.value,
        password: this.formularioRegistro.get('password')?.value,
        perfil: this.formularioRegistro.get('perfil')?.value,
        rut: this.formularioRegistro.get('nombreUsuario')?.value
      };
      console.log(usuario);

      this.apiService.postAddUser(usuario.nombre, usuario.ap_paterno, usuario.mail, usuario.password, usuario.perfil.perfilCod, usuario.rut)
        .subscribe((data: any) => {
          console.log('Usuario grabado exitosamente:', data);
          // this.cookies.set('perfil', data.perfil);
          this.MjePantalla('ok', 'Usuario registrado exitosamente.')
        },
          (error) => {
            console.error('Error al obtener los datos', error);
            this.MjePantalla('error', 'Error al obtener los datos. Error: ' + error.message)
          });

      // this.formularioRegistro.reset();
    }
  }

  /**
   * 
   * @param fechaNacimiento calcula la fecha de nacimiento para obtener la edad
   * @returns devuleve la edad
   */
  calcularEdad(fechaNacimiento: string): number {
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth();
    const diaActual = fechaActual.getDate();

    const date = new Date(fechaNacimiento);

    const añoNacimiento = date.getFullYear();
    const mesNacimiento = date.getMonth();
    const diaNacimiento = date.getDate();

    let edad = añoActual - añoNacimiento;

    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edad--;
    }

    return edad;
  }


  validarEdad(): void {
    const fechaNacimientoValue = this.formularioRegistro.get('fechaNacimiento')?.value;
    const edad = this.calcularEdad(fechaNacimientoValue);
    this.edadValida = edad >= 13;
  }

  MjePantalla(tipo: String, mje: String) {
    switch (tipo) {
      case 'error':
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: '' + mje
        });
        break;
      case 'ok':
        Swal.fire({
          title: mje,
          icon: "success",
          draggable: true
        });
    }

  }
}
