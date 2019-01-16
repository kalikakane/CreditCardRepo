import { Injectable } from '@angular/core';
import { AppConstants } from './app-constants';
import { CreditCard } from './credit-card';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  constructor() { }

  	checkNumeric(num): boolean{
  		return (num.match(/[^0-9]/))? false: true;
  	}

  	checkLength(creditCard: CreditCard): string{
  		debugger;
  		let newNumber = creditCard.cardNumber;
  		let result = "";
  		switch(creditCard.cardType){
  			case AppConstants.VISA:
  				result = (newNumber.length < 13 || newNumber.length > 16)? "Card number must be 13 to 16 digits long" : "";
  				break;
  			case AppConstants.DISCOVER:
  			case AppConstants.MASTER:
  				result = (newNumber.length === 16)? "" : "Card number must be 16 digits long";
  				break;
  			case AppConstants.AMEX:
  				result = (newNumber.length === 15)? "" : "Card number must be 15 digits long";
  				break;
  			default:
  				result = "Card number must be between 13 and 16 digits long.";
  		}
  		return result;
  	}

  	formatCardNumber(creditCard: CreditCard){
  		let num = creditCard.cardNumber;
  		switch(creditCard.cardType){
  			case AppConstants.VISA:
  			case AppConstants.DISCOVER:
  			case AppConstants.MASTER:
  				num = num.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4");
  			break;
  			case AppConstants.AMEX:
  				num = num.replace(/(\d{4})(\d{6})(\d{5})/, "$1-$2-$3");
  			break;
  			default:
  				num = num;
  		}
  		return num;
  	}

  	getCardType(newNumber): AppConstants{ 
  		var ccType = AppConstants.NOCARD;	
  		switch(newNumber[0]){
  				case "3":
  					ccType = (newNumber.length>1)? ((newNumber[1]=="7")?AppConstants.AMEX:AppConstants.INVALID):ccType = AppConstants.NOCARD;
  					break;
  				case "4":
  					ccType = AppConstants.VISA;
  					break;
  				case "5":
  					ccType = AppConstants.MASTER;
  					break;
  				case "6":
  					ccType = AppConstants.DISCOVER;
  					break;
  				default:
  					ccType = AppConstants.INVALID;
  		}

  		return ccType;		
  	}

  	getCardDetail(): Observable<CreditCard>{
  		var creditCardDetail = {cardNumber:'', cardType: AppConstants.NOCARD};
  		creditCardDetail = (sessionStorage.getItem('cardDetail')!==null)? 
  								JSON.parse(sessionStorage.getItem('cardDetail')):
  								creditCardDetail;
  		return of(creditCardDetail);
  	}

  	saveCardDetail(data: CreditCard): void{
  		sessionStorage.removeItem('cardDetail');
  		sessionStorage.setItem('cardDetail', JSON.stringify(data));
  		console.log(sessionStorage.getItem('cardDetail'));
  	}
}
