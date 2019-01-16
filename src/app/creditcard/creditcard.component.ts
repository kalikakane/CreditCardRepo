import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CreditCardService } from '../credit-card.service';
import { CreditCard } from '../credit-card';
import { AppConstants } from '../app-constants';

@Component({
  selector: 'app-creditcard',
  templateUrl: './creditcard.component.html',
  styleUrls: ['./creditcard.component.css']
})
export class CreditcardComponent implements OnInit {
	creditCardForm = new FormGroup({
		cardNumber: new FormControl('')
	});

	creditCard: CreditCard;

	cardTypeImg: string = '';
	errorMsg: string = '';
	allowSave: boolean;

 	constructor(private creditCardService: CreditCardService) { 

 	}

	ngOnInit() {		
  		this.initialize();
  		this.setCardNetworkIcon();
	}	

  	onSubmit(): void{
  		debugger;
  		var newNumber = this.creditCard.cardNumber;
		this.creditCard.cardNumber = newNumber.replace(/-/g, '');
		var msg = this.creditCardService.checkLength(this.creditCard);
		if(msg!=="") {
			this.errorMsg = msg;
		}
		else{
			this.creditCardService.saveCardDetail(this.creditCard);
  			this.fillForm();
		}
  		this.allowSave = false;
  	}

	initialize(): void{
		
		this.creditCardService.getCardDetail().subscribe(creditCardDetail => this.creditCard=creditCardDetail);
		
		this.fillForm();

		this.creditCardForm.get('cardNumber').valueChanges.subscribe((newNumber) => {
			this.captureChanges(newNumber);		
		});
	}

	captureChanges(ccNum): void{
		debugger;
		if(ccNum.length!==undefined && ccNum.length!==0 && ccNum.length!=="0"){
			ccNum = ccNum.replace(/-/g, '');
			if(this.creditCardService.checkNumeric(ccNum)){
				this.creditCard.cardNumber = ccNum;
				let ctype = this.creditCardService.getCardType(ccNum);
				if(ctype!==AppConstants.INVALID){
					this.creditCard.cardType = ctype;
					this.setCardNetworkIcon();
					this.errorMsg = '';
					this.allowSave = true;
				}
				else{
					this.creditCard.cardType = ctype;
					this.setCardNetworkIcon();
					this.errorMsg = 'Seems like an invalid card number!';
					this.allowSave = false;
				}
			}
			else{
				this.creditCard.cardType = AppConstants.INVALID;
				this.setCardNetworkIcon();
				this.errorMsg = 'Please enter numbers only!'
				this.allowSave = false;
			}	
		}	
		else{
			this.creditCard.cardType = AppConstants.INVALID;
			this.setCardNetworkIcon();
			this.errorMsg = '';
			this.allowSave = false;
		}
	}

	fillForm(): void{
		this.errorMsg = '';
		if(this.creditCard!==null && this.creditCard!==undefined){
			this.creditCardForm.patchValue({
				cardNumber:this.creditCardService.formatCardNumber(this.creditCard),
			});
		}
	}

	checkOnBlur(event): void{
		if(event.relatedTarget!=null && event.relatedTarget.id === "submit"){
		    event.stopImmediatePropagation();
		    this.allowSave = true;
		}
		else{
			var newNumber = event.target.value;
			this.captureChanges(newNumber);	
			var msg = this.creditCardService.checkLength(this.creditCard);
			if(msg!=="") {
				this.errorMsg = msg;
				this.allowSave = false;
			}
			else{
				this.allowSave = true;
			}
		}
  		
	}

  	setCardNetworkIcon(): void{
		this.cardTypeImg = `./assets/images/icons/${this.creditCard.cardType}.svg`;
  	}
  	  	
}
