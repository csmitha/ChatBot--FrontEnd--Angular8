import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService } from './modal.service';
import { AlertService, RestapiService } from '../_services';
import { throwError } from 'rxjs';
import { ChatHistory } from '.';

@Component({ 
    selector: 'jw-modal', 
    templateUrl: 'modal.component.html', 
    styleUrls: ['modal.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() id: string;
    private element: any;

    historyList: ChatHistory[];


    constructor(private modalService: ModalService, private el: ElementRef, private restapiService: RestapiService,
        private alertService: AlertService,
        ) {
        this.element = el.nativeElement;
        
    }

    ngOnInit(): void {
        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // close modal on background click
        this.element.addEventListener('click', el => {
            if (el.target.className === 'jw-modal') {
                this.close();
            }
        });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(username): void {
        this.element.style.display = 'block';
        
        this.restapiService.getUserChatHistory(username)        
        .subscribe(
            data => {
                if (data) {
                    console.log(data);
                    this.historyList =data;
                } else {
                    const error = "Hisotry not found for user";
                    return throwError(error);
                }
            },
            error => {
                this.alertService.error(error);
                
            });

        document.body.classList.add('jw-modal-open');
    }

    // close modal
    close(): void {
        this.element.style.display = 'none';
        document.body.classList.remove('jw-modal-open');
    }
}