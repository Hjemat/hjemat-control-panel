export class Product {
    productID: number;
    name: string;
    description: string;
    values: ProductValue[];
}

export class ProductValue {
    id: number;
    primary: boolean;
    name: string;
    description: string;

    type: string;
    readonly: Boolean;
    readPeriodically: Boolean;

    suffix: string;
    
    trueLabel: string;
    falseLabel: string;
    setTrueLabel: string;
    setFalseLabel: string;
}