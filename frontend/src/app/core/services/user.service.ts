import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Observable } from "rxjs/internal/Observable";
import { HttpClient } from "@angular/common/http";
import { UserProfile } from "../../shared/interfaces/auth.model";

interface ProfileResponse {
  message: string;
  data: UserProfile;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/user`;

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/profile`);
  }

  updateProfile(data: Partial<UserProfile>): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.apiUrl}/profile`, data);
  }
}
