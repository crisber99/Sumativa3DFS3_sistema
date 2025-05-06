import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from '../../Service/api-service.service';
import Swal from 'sweetalert2';
import { log } from 'console';
import { response } from 'express';


/**
 * @description
 * Componente que valida el ingreso de los usuarios.
 */
/**
 * @usageNotes
 * 
 * el metodo 'ingresar' valida que el usuario este creado.
 * el metodo 'recuperarContrasena' redirecciona al componente RecuperaPassComponent
 * 
 */

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formularioLogin!: FormGroup;
  respuesta!: string;

  constructor(
    private router: Router,
    private cookies: CookieService,
    private apiService: ApiServiceService,
  ) { }

  Usuarios: any[] = [];
  mensaje = '';

  ngOnInit(): void {
    this.formularioLogin = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.minLength(6)]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  ingresar(): void {
    if (this.formularioLogin.valid) {

      const login = {
        nombreUsuario: this.formularioLogin.get('userName')?.value,
        password: this.formularioLogin.get('contrasena')?.value,
      };

      console.log('Intentando iniciar sesión:', { login });

      this.apiService.postUsuarioLogin(login.nombreUsuario, login.password)
        .subscribe((data: any) => {
          console.log('Inicio de sesión exitoso:', data);
          this.cookies.set('perfil', data.perfil);
          this.router.navigate(['/home']);
        },
          (error) => {
            console.error('Error al obtener los datos', error);
            this.MjePantalla('error', 'Error al obtener los datos. Error: ' + error.message)
          });


    }
  }

  recuperarContrasena(): void {
    // Redireccionar a la página de recuperación de contraseña
    this.router.navigate(['recupera-pass']);
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
          title: "Drag me!",
          icon: "success",
          draggable: true
        });
    }
  }
}
