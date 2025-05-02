import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule, ValidatorFn, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
      ,{ validators: this.validaPassRepit }
    
    );
  
    }
  
    Perfiles: any[] = this.perfiles;
  
    ngOnInit(): void {
    }
  
    togglePasswordVisibility(field: 'password' | 'repetirPassword'): void {
      if (field === 'password') {
        this.showPassword = !this.showPassword;
      } else {
        this.showRepeatPassword = !this.showRepeatPassword;
      }
    }
  
    passwordMatchValidator(g: FormGroup) {
      return g.get('password')?.value === g.get('repetirPassword')?.value ? null : { mismatch: true };
    }
  
    public passwordValidator(): ValidatorFn {
      return () => {
  
        const password = this.formularioRegistro.get('password')?.value;
        const repeat_password = this.formularioRegistro.get('repeat_password')?.value;
  
        if(!password || !repeat_password) return { isValid: false };
  
        if(password!==repeat_password) return {isValid:false};      
        
        return null;
      };
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
      const {password, repetirPassword} = Control.value;
  
  
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
          nombreUsuario: this.formularioRegistro.get('nombreUsuario')?.value,
          mail: this.formularioRegistro.get('mail')?.value,
          password: this.formularioRegistro.get('password')?.value,
          fechaNacimiento: this.formularioRegistro.get('fechaNacimiento')?.value,
          perfil: this.formularioRegistro.get('perfil')?.value
        };
        console.log(usuario);
  
        // const registroExitoso = this.servicioReg.registrarUsuario(usuario.mail, usuario.password,
        //   usuario.nombreUsuario, usuario.fechaNacimiento, usuario.perfil.perfilName);
        // if (registroExitoso) {
        //   console.log('Registro exitoso:', { usuario });
  
        // } else {
        //   console.log('Error en el registro.');
        // }
        // this.resultado = registroExitoso;
        this.formularioRegistro.reset();
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
}
