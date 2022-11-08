import { Component } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listening = false;
  languages: string[];
  language = 'en-US';
  translateText: string;

  constructor() {
    SpeechRecognition.requestPermission();
    this.getLanguages();
  }

  async getLanguages() {
    await SpeechRecognition.getSupportedLanguages().then(data => this.languages = data.languages);
  }

  changeLanguage(event: any) {
    this.language = event.detail.value;
  }

  async startListening() {
    const { available } = await SpeechRecognition.available();

    if (available) {
      this.listening = true;
      SpeechRecognition.start({
        language: this.language,
        maxResults: 1,
        partialResults: false,
        popup: false,
    }).then(result => {
        if (result.matches[0]) {
          this.translateText = result.matches[0];
          this.stopListening();
        }
    });
    }

  }

  stopListening() {
    this.listening = false;
    SpeechRecognition.stop();
  }

}
