import { Component } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-language-modal',
  templateUrl: './language-modal.component.html',
  styleUrls: ['./language-modal.component.scss'],
})
export class LanguageModalComponent {

  languages: string[];
  languagesFilter: string[];

  constructor(private modalCtrl: ModalController) {
    this.getLanguages();
  }

  async getLanguages() {
    await SpeechRecognition.getSupportedLanguages().then(data => this.languages = data.languages.sort());
    this.languagesFilter = this.languages;
  }

  dismiss(value: any) {
    return this.modalCtrl.dismiss(value);
  }

  search(query) {
    if (!query) {
      this.languagesFilter = [...this.languages];
    } else {
      this.languagesFilter = this.languages.filter((lang) => lang.toLowerCase().includes(query.toLowerCase()));
    }
  }

}
