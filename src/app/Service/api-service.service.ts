import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private urlUsuario = 'http://localhost:8080/usuario';

  constructor(private http: HttpClient) { }

  getUsuarioAll(){
    return this.http.get(this.urlUsuario);
  }

  postUsuarioLogin(rut: String, pass: String){
    // return this.http.post(this.urlUsuario + '/login', {rut, pass});
    return this.http.post(`${this.urlUsuario}/login`, { rut, pass });
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
