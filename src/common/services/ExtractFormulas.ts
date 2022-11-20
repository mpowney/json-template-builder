export interface IVariableValue {
    foundText: string;
    key: string;
    value?: any;
}

export default class ExtractFormulas {

    public static GetVariables(json: any): IVariableValue[] {
        let returnValues: IVariableValue[] = [];

        if (json.txtContent) {
            const matches = (json.txtContent as string).matchAll(/\[?([\$|@][^\]]+)\]?/gi);
            for (const match in matches) {
                if (returnValues.find(value => value.foundText === match[0]) === null) returnValues.push({ foundText: match[0], key: match[1] });
            }
        }

        if (json.children && Array.isArray(json.children)) {
            json.children.forEach((child: any) => { returnValues.push(...ExtractFormulas.GetVariables(child)) })
            
        }

        return returnValues;
    }

    public static GetFormulas(json: any): any {
        
    }
}