export class CommonFunction {
    static setDate(data) {
        if (data !== '' && data !== null) {
            return new Date(data.toString().split('T')[0].split('-').toString());
        }
        return;
    }

    getValue(list, id, idName, valueName) {
        const obj = list.find(index => index[idName] === id);
        const viewValue = obj[valueName];
        return viewValue;
    }

    columnTotal(dataSource, columnName) {
        let amount = 0;
        dataSource.data.forEach((element) => {
            amount = amount + Number(element[columnName]);
        });
        return amount;
    }


}
