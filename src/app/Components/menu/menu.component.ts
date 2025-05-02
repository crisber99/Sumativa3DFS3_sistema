import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  providers: [CookieService]
})
export class MenuComponent {
  private destroy$ = new Subject<void>();
  constructor(
      //private jsonUsuario: UsuarioService,
      private cookies: CookieService,
    ) { }

    Usuarios: any[] = [];

    ngOnInit(): void {
      // this.jsonUsuario.getJsonDataUsuario().subscribe(data => {
      //   this.Usuarios = data;
      // });
    }

    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
    
  getPerfil(){
    if(this.cookies.get("perfil") != null){
      if(this.cookies.get('perfil')?.toUpperCase() == 'ADMIN') return true; else return false;
    }
    else return false;

    location.reload();
  }
}
