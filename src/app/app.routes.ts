import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { CategoriaComponent } from './Components/categoria/categoria.component';
import { PrincipalComponent } from './Components/principal/principal.component';
import { UsuarioComponent } from './Components/usuario/usuario.component';
import { TemasComponent } from './Components/temas/temas.component';
import { RolComponent } from './Components/rol/rol.component';
import { RecuperaPassComponent } from './Components/recupera-pass/recupera-pass.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'principal', component: PrincipalComponent},
    {path: 'usuario', component: UsuarioComponent},
    {path: 'temas', component: TemasComponent},
    {path: 'rol', component: RolComponent},
    {path: 'categoria', component: CategoriaComponent},
    {path: 'recupera-pass', component: RecuperaPassComponent}
];
