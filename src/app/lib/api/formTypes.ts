export interface BaseFormField {
    fieldName: string;
    ratingFieldName?: string;
    label: string;
    tooltip: string;
    required?: boolean;
    order?: number;
    multiline?: boolean;
}

export interface TextFormField extends BaseFormField {
    type?: 'text';
    multiline?: boolean;
}

export interface NumberFormField extends BaseFormField {
    type?: 'number';
    multiline?: boolean;
}

export interface SelectFormField extends BaseFormField {
    type: 'select';
    options: string[];
}

export interface SliderFormField extends BaseFormField {
    type: 'slider';
    min: number;
    max: number;
    marks: { value: number; label: string }[];
}

export interface RadioFormField extends BaseFormField {
    type: 'radio';
    options: { value: number | string; label: string }[];
    orientation?: 'horizontal' | 'vertical';
}

export interface BooleanFormField extends BaseFormField {
    type: 'boolean';
}

export interface DateFormField extends BaseFormField {
    type: 'date';
}

export type FormField =
    | TextFormField
    | NumberFormField
    | SelectFormField
    | SliderFormField
    | RadioFormField
    | BooleanFormField
    | DateFormField;

export type FormFieldValue<T extends FormField> =
    T extends BooleanFormField ? boolean :
        T extends SliderFormField ? number :
            T extends RadioFormField ? number | string :
                T extends SelectFormField ? string :
                    T extends DateFormField ? string :
                        string;