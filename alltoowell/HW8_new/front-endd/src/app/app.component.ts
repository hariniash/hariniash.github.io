import { Component } from '@angular/core';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-endd';
  fasStar = fasStar;
  farStar = farStar;
}
