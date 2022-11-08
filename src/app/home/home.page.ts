import { Component } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { LanguageModalComponent } from '../language-modal/language-modal.component';

import { parse } from 'bcp-47';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listening = false;
  fromLanguage = 'en-US';
  toLanguage = 'pt-BR';
  toTranslateText: string;
  translatedText: string;
  openingFromModal = false;
  openingToModal = false;

  constructor(private modalCtrl: ModalController, private toastController: ToastController) {
    SpeechRecognition.requestPermission();
  }

  async noLanguageToast() {
    const toast = await this.toastController.create({
      message: 'Select a language first',
      color: 'danger',
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }

  async noTextToast() {
    const toast = await this.toastController.create({
      message: 'Type the text to be translated before',
      color: 'primary',
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }

  async startListening() {
    if (!this.fromLanguage) {
      return this.noLanguageToast();
    }

    const { available } = await SpeechRecognition.available();

    if (available) {
      this.listening = true;
      SpeechRecognition.start({
        language: this.fromLanguage,
        maxResults: 1,
        partialResults: false,
        popup: false,
    }).then(result => {
        if (result.matches[0]) {
          this.toTranslateText = result.matches[0];
          this.stopListening();
        }
    });
    }

  }

  stopListening() {
    this.listening = false;
    SpeechRecognition.stop();
  }

  openModal(modal: string) {
    return modal === 'from' ? this.openFromModal() : this.openToModal();
  }

  async openFromModal() {
    this.openingFromModal = true;
    this.openingToModal = false;

    const modal = await this.modalCtrl.create({
      component: LanguageModalComponent,
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data === null) {
      return;
    }
    this.fromLanguage = data;
  }

  async openToModal() {
    this.openingFromModal = false;
    this.openingToModal = true;

    const modal = await this.modalCtrl.create({
      component: LanguageModalComponent,
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data === null) {
      return;
    }
    this.toLanguage = data;
  }

  async ttsSpeak() {
    if (!this.toTranslateText) {
      return this.noTextToast();
    }

    const froml: string = parse(this.fromLanguage).language;
    const tol: string = parse(this.toLanguage).language;

  }
}
