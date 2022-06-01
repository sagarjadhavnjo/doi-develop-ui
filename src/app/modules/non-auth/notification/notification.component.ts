import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
    constructor(private snackBar: MatSnackBar) {}

    closeSnakeBar() {
        this.snackBar.dismiss();
    }
}
