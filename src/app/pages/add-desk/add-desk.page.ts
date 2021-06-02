import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Desk } from 'src/app/models/resources';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-desk',
  templateUrl: './add-desk.page.html',
  styleUrls: ['./add-desk.page.scss'],
})
export class AddDeskPage implements OnInit {
  desk: Desk;
  constructor(
    private modalController: ModalController,
    private afs: AngularFirestore,
  ) {

  }

  ngOnInit() {
    this.desk = {
      id: '',
      name: 'Tisch 1',
      description: 'Eine Beschreibung',
      picture: '/assets/img/desks/desk-1.jpeg',
    };
  }
  dismiss(booked) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      booked
    });
  }

  async takePicture(){
    const image = await Camera.getPhoto({
      quality: 90,
      correctOrientation: true,
      source: CameraSource.Prompt,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });

    this.desk.picture = 'data:image/' + image.format.toLowerCase() + ';base64,'  + image.base64String;

}

async addResource(desk){

  console.log(this.desk);
  console.log(desk);

    const newDesk = await this.afs.collection('desks').add(desk);
    await this.afs.collection('desks').doc(newDesk.id).set({
      id: newDesk.id
    },
    {
      merge: true
    });
    this.dismiss(true);
  }
}
