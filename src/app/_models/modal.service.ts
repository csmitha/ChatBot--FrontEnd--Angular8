﻿import { Injectable } from '@angular/core';
import { AlertService, RestapiService } from '../_services';
import { ChatHistory } from '.';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private modals: any[] = [];
    historyList: ChatHistory[];

    constructor(
      
        private restapiService: RestapiService,
        private alertService: AlertService,
        
    ) {// redirect to home if already logged in
      
        }

    add(modal: any) {
        // add modal to array of active modals
        this.modals.push(modal);
    }

    remove(id: string) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x.id !== id);
    }

    open(id: string,userName:string) {
       

 // open modal specified by id
       const modal = this.modals.find(x => x.id === id);
        modal.open(userName);
    }

    close(id: string) {
        // close modal specified by id
        const modal = this.modals.find(x => x.id === id);
        modal.close();
    }
}