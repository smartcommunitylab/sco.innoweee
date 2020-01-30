import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  

  constructor(
    private alertController:AlertController,
    private router:Router
  ) { }
  handleError(error: any): Promise<any> {

    return new Promise<string>(async (resolve, reject) => {
      console.error('An error occurred', error);

      if (error.status == 401){
        // display toast and redirect to logout.
        // var errorObj = JSON.parse(error._body)
        // var errorMsg = 'Per favore accedi di nuovo.';
        // if (errorObj.errorMsg) {
        //   errorMsg = errorObj.errorMsg;
        // }
      } else if  (error.status == 403){
        const alert = await this.alertController.create({
          header: 'Utente non registrato',
          subHeader: "L'utente inserito non e' registrato",
          message: 'Utilizzare le credenziali fornite con la documentazione',
          backdropDismiss: false ,
          buttons: [{
            text: 'Riavvia',
            handler: () => {
              this.router.navigate(['']);
            }
        }]
        });
        return await alert.present();

      } else if (error.error && error.error.errorMsg=="EC11:item already confirmed")
      {
        const alert = await this.alertController.create({
          header: "Oggetto gia' inserito",
          subHeader: "L'oggetto risulta gia' inserito",
          message: "L'oggetto risulta gia' inserito nel database. In caso contrario procedere con la registrazione alla lavagna",
          backdropDismiss: false ,
          buttons: [{
            text: 'Annulla'
        },{
          text: 'Inserisci nuovo oggetto',
          handler: () => {
            this.router.navigate(['start']);
          }
      }]
        });
        return await alert.present();

      }else if (error.error && error.error.errorMsg=="EC12:playerId not corresponding show alert")
      {
        const alert = await this.alertController.create({
          header: "Classe differente",
          message: "L'utente che ha catalogato l'oggetto risulta appartenere ad un'altra classe. Verificare chi ha effettuato l'inserimento",
          backdropDismiss: false ,
          buttons: [{
            text: 'Annulla'
        },{
          text: 'Inserisci nuovo oggetto',
          handler: () => {
            this.router.navigate(['start']);
          }
      }]
        });
        return await alert.present();

      }
      else{
        
          //loading was wrong, reload app
    
          const alert = await this.alertController.create({
            header: 'Errore di comunicazione',
            subHeader: 'Problema nella comunicazione con il server',
            message: 'Riavvia l\'aplicazione e assicurati di avere connettivita`',
            backdropDismiss: false ,
            buttons: [{
              text: 'Riavvia',
              handler: () => {
                window.location.reload();
              }
          }]
          });
          return await alert.present();
        }      
    });

  }
}
