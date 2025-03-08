export interface BaseFormField {
    fieldName: string;
    ratingFieldName?: string;
    label: string;
    tooltip: string;
    required?: boolean;
    order?: number;
}

export interface TextFormField extends BaseFormField {
    type?: 'text';
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

export interface BooleanFormField extends BaseFormField {
    type: 'boolean';
}

export type FormField = TextFormField | SelectFormField | SliderFormField | BooleanFormField;

export type FormFieldValue<T extends FormField> =
    T extends BooleanFormField ? boolean :
        T extends SliderFormField ? number :
            T extends SelectFormField ? string :
                string;