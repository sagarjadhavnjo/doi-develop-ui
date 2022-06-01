import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Directive, HostBinding, ElementRef, TemplateRef, HostListener, Input, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[numbersOnly]'
})

export class NumbersOnlyDirective {

    constructor(private _el: ElementRef, private ngControl: NgControl) { }

    @HostListener('input', ['$event']) onInputChange(event) {
        const initalValue = this._el.nativeElement.value;

        this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
        this.ngControl.control.patchValue(this._el.nativeElement.value);
        if (initalValue !== this._el.nativeElement.value) {
            event.stopPropagation();
        }
    }
}


@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[cdkDetailRow]'
})

export class CdkDetailRowDirective {
    private row: any;
    private tRef: TemplateRef<any>;
    private opened: boolean;

    @HostBinding('class.expanded')
    get expended(): boolean {
        return this.opened;
    }

    @Input()
    set cdkDetailRow(value: any) {
        if (value !== this.row) {
            this.row = value;
            // this.render();
        }
    }

    @Input('cdkDetailRowTpl')
    set template(value: TemplateRef<any>) {
        if (value !== this.tRef) {
            this.tRef = value;
            // this.render();
        }
    }

    constructor(public vcRef: ViewContainerRef) { }

    @HostListener('click')
    onClick(): void {
        this.toggle();
    }

    toggle(): void {
        if (this.opened) {
            this.vcRef.clear();
        } else {
            this.render();
        }
        this.opened = this.vcRef.length > 0;
    }

    private render(): void {
        this.vcRef.clear();
        if (this.tRef && this.row) {
            this.vcRef.createEmbeddedView(this.tRef, { $implicit: this.row });
        }
    }
}

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[app-common-directive]'
})
export class CommonDirective {

    constructor(private router?: Router) { }
    // selection = new SelectionModel<any>(true, []);

    selection = new SelectionModel<any>(true, []);
    selection1 = new SelectionModel<any>(true, []);
    // ------------------CheckBox Functions---------------------------
    masterToggle(dataSource) {
        this.isAllSelected(dataSource)
            ? this.selection.clear()
            : dataSource.data.forEach(row =>
                this.selection.select(row)
            );
    }

    isAllSelected(dataSource) {
        const numSelected = this.selection.selected.length;
        const numRows = dataSource.data.length;
        return numSelected === numRows;
    }

    checkboxLabel(dataSource, row?: any): string {
        if (!row) {
            return `${this.isAllSelected(dataSource) ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'
            } row ${row.position + 1}`;
    }
    // -----------------------------------------------------------------
    // ------------------CheckBox Functions If there are 2 checkbox in one screen---------------------------
    masterToggle1(dataSource) {
        this.isAllSelected1(dataSource)
            ? this.selection1.clear()
            : dataSource.data.forEach(row =>
                this.selection1.select(row)
            );
    }

    isAllSelected1(dataSource) {
        const numSelected = this.selection1.selected.length;
        const numRows = dataSource.data.length;
        return numSelected === numRows;
    }

    checkboxLabel1(dataSource, row?: any): string {
        if (!row) {
            return `${this.isAllSelected1(dataSource) ? 'select' : 'deselect'} all`;
        }
        return `${this.selection1.isSelected(row) ? 'deselect' : 'select'
            } row ${row.position + 1}`;
    }
    // -----------------------------------------------------------------

    // Method to Reset Form
    resetForm(formName) {
        formName.reset();
    }

    // Method to redirect to another screen
    goToScreen(path) {
        this.router.navigate([path]);
    }

    // Method to get viewValue from value
    getViewValue(list, value) {
        let viewValue;
        list.forEach(item => {
            if (item.value === '' + value) { viewValue = item.viewValue; }
        });
        return viewValue;
    }

    // Method to get value from viewValue
    getValue(list, viewValue) {
        let value;
        list.forEach(item => {
            if (item.viewValue === '' + viewValue) { value = item.value; }
        });
        return value;
    }

    // Method to Delete Row
    deleteRow(dataSource, index) {
        dataSource.data.splice(index, 1);
        dataSource.data = dataSource.data;
    }

    columnTotal(dataSource, columnName) {
        let amount = 0;
        dataSource.data.forEach((element) => {
            amount = amount + Number(element[columnName]);
        });
        return amount;
    }
}
