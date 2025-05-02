import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


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
  formularioLogin!:FormGroup;
  respuesta!: string;
  // sessionPerfil = sessionStorage.getItem('perfil');

  constructor(
    private router: Router,
    private cookies: CookieService,
    // private servicioReg: RegistroService,
    // private jsonUsuario: UsuarioService
  ) { }

  Usuarios: any[] = [];
 
  ngOnInit(): void {
    // this.jsonUsuario.getJsonDataUsuario().subscribe(data => {
    //   this.Usuarios = data;
    // });

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
      // Llamar al servicio de autenticación

      console.log('Intentando iniciar sesión:', { login });

      const usuario = this.Usuarios.find(user => (user.username === login.nombreUsuario) && user.password === login.password);
      if (usuario) {
        console.log('Inicio de sesión exitoso:', usuario);
        this.cookies.set('perfil', usuario.perfil);
        this.router.navigate(['/inicio']);
      } else {
        console.log('Usuario o contraseña incorrectos.');
        this.cookies.set('perfil', '');
      }
    }
  }
 
  recuperarContrasena(): void {
    // Redireccionar a la página de recuperación de contraseña
    this.router.navigate(['recupera-pass']);
  }
}
