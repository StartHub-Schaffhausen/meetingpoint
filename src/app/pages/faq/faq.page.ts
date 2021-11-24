import {  Component,  OnInit} from '@angular/core';
import {  Browser} from '@capacitor/browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  constructor() {}

  ngOnInit() {}

  async openLink(link) {
    await Browser.open({
      url: link
    });


  }

}
