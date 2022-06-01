import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {
    transform(value: any, withDecimal?: string): any {
        if (value) {
            if (withDecimal) {
                return this.convertDecimalNumberToWords(value);
            } else {
                return this.convertNumberToWords(value);
            }
        } else {
            return '';
        }
    }

    convertNumberToWords(price, showOnly = true, showPaisa = false) {
        const sglDigit = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'],
            dblDigit = [
                'Ten',
                'Eleven',
                'Twelve',
                'Thirteen',
                'Fourteen',
                'Fifteen',
                'Sixteen',
                'Seventeen',
                'Eighteen',
                'Nineteen'
            ],
            tensPlace = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'],
            handle_tens = function(dgt, prevDgt) {
                return 0 === dgt ? '' : ' ' + (1 === dgt ? dblDigit[prevDgt] : tensPlace[dgt]);
            },
            handle_utlc = function(dgt, nxtDgt, denom) {
                return (
                    (0 !== dgt && 1 !== nxtDgt ? ' ' + sglDigit[dgt] : '') +
                    (0 !== nxtDgt || dgt > 0 ? ' ' + denom : '')
                );
            };

        let str = '',
            digitIdx = 0,
            digit = 0,
            nxtDigit = 0;
        const words = [];
        if (((price += ''), isNaN(parseInt(price, null)))) {
            str = '';
        } else if (parseInt(price, null) > 0 && price.length <= 10) {
            for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) {
                switch (
                    ((digit = price[digitIdx] - 0),
                    (nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0),
                    price.length - digitIdx - 1)
                ) {
                    case 0:
                        words.push(handle_utlc(digit, nxtDigit, ''));
                        break;
                    case 1:
                        words.push(handle_tens(digit, price[digitIdx + 1]));
                        break;
                    case 2:
                        words.push(
                            0 !== digit
                                ? ' ' +
                                      sglDigit[digit] +
                                      ' Hundred' +
                                      (0 !== price[digitIdx + 1] && 0 !== price[digitIdx + 2] ? '' : '')
                                : ''
                        );
                        break;
                    case 3:
                        words.push(handle_utlc(digit, nxtDigit, 'Thousand'));
                        break;
                    case 4:
                        words.push(handle_tens(digit, price[digitIdx + 1]));
                        break;
                    case 5:
                        words.push(handle_utlc(digit, nxtDigit, 'Lakh'));
                        break;
                    case 6:
                        words.push(handle_tens(digit, price[digitIdx + 1]));
                        break;
                    case 7:
                        words.push(handle_utlc(digit, nxtDigit, 'Crore'));
                        break;
                    case 8:
                        words.push(handle_tens(digit, price[digitIdx + 1]));
                        break;
                    case 9:
                        words.push(
                            0 !== digit
                                ? ' ' +
                                      sglDigit[digit] +
                                      ' Hundred' +
                                      (this.checkCroreNumber(+price) &&
                                      (0 !== price[digitIdx + 1] || 0 !== price[digitIdx + 2])
                                          ? ' and'
                                          : ' Crore')
                                : ''
                        );
                }
            }
            str = words.reverse().join('');
            str += (!showPaisa ? ' rupees' : ' paisa') + (showOnly ? ' only' : '');
        } else {
            str = '';
        }
        return str;
    }

    checkCroreNumber(price) {
        let isValid = false;
        if (price) {
            const numberList = [];
            for (let index = 1; index <= 9; index++) {
                numberList.push(index * 1000000000);
            }
            isValid = !numberList.some(x => x === price);
            return isValid;
        }

        return isValid;
    }

    convertDecimalNumberToWords(n) {
        const nums = n.toString().split('.');
        const whole = this.convertNumberToWords(nums[0], false, false);

        if (nums[1] && nums[1] > 0) {
            nums[1] = nums[1].length > 1 ? nums[1] : +(nums[1] + '0');
        }
        const fraction = this.convertNumberToWords(nums[1], true, true);
        if (fraction) {
            return whole + ' and ' + fraction;
        } else {
            return whole + ' only ';
        }
    }
}
