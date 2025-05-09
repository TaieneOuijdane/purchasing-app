import React from 'react';
import type { Control, FieldError, FieldErrors, FieldValues, Path, PathValue } from 'react-hook-form';
import { Controller} from 'react-hook-form';

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'checkbox';
  required?: boolean;
  options?: { value: string; label: string }[];
  col?: 'full' | 'half';
  minLength?: number;
  disabled?: boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
  validationRules?: Record<string, any>;
  hidden?: boolean;
}

interface EntityFormProps<T extends FieldValues> {
  title: string;
  fields: FormField<T>[];
  errors: FieldErrors<T>;
  control: Control<T>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel: string;
}

const EntityForm = <T extends FieldValues>({
  title,
  fields,
  errors,
  control,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel
}: EntityFormProps<T>) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-teal-800">{title}</h3>
        </div>
        
        <form onSubmit={onSubmit} autoComplete="off">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {fields
                .filter(field => field.col === 'half' && !field.hidden)
                .map(field => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={field.validationRules || { 
                        required: field.required ? `Ce champ est requis` : false,
                        minLength: field.minLength ? {
                          value: field.minLength,
                          message: `Minimum ${field.minLength} caractères requis`
                        } : undefined,
                        pattern: field.pattern
                      }}
                      render={({ field: fieldProps }) => {
                        if (field.type === 'checkbox') {
                          const { onChange, value, ref } = fieldProps;
                          return (
                            <input
                              type="checkbox"
                              id={field.name}
                              checked={!!value}
                              onChange={onChange}
                              ref={ref}
                              disabled={field.disabled}
                              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                          );
                        }
                        
                        if (field.type === 'select' && field.options) {
                          return (
                            <select
                              {...fieldProps}
                              id={field.name}
                              disabled={field.disabled}
                              className={`mt-1 block w-full border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                            >
                              {field.options.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          );
                        }
                        
                        return (
                          <input
                            {...fieldProps}
                            type={field.type}
                            id={field.name}
                            disabled={field.disabled}
                            className={`mt-1 block w-full border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                            autoComplete={field.type === 'password' ? 'new-password' : 'off'}
                          />
                        );
                      }}
                    />
                    {errors[field.name as string] && (
                      <p className="mt-1 text-sm text-red-600">
                        {String(errors[field.name as string]?.message || "Ce champ est invalide")}
                      </p>
                    )}
                  </div>
                ))}
            </div>
            
            {fields
              .filter(field => field.col !== 'half' && !field.hidden)
              .map(field => (
                <div key={field.name} className={field.type === 'checkbox' ? 'flex items-center' : ''}>
                  {field.type === 'checkbox' ? (
                    <>
                      <Controller
                        name={field.name}
                        control={control}
                        render={({ field: { onChange, value, ref } }) => (
                          <input
                            type="checkbox"
                            id={field.name}
                            checked={!!value}
                            onChange={onChange}
                            ref={ref}
                            disabled={field.disabled}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          />
                        )}
                      />
                      <label htmlFor={field.name} className="ml-2 block text-sm text-gray-700">
                        {field.label}
                      </label>
                    </>
                  ) : (
                    <>
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      <Controller
                        name={field.name}
                        control={control}
                        rules={field.validationRules || {
                          required: field.required ? `Ce champ est requis` : false,
                          minLength: field.minLength ? {
                            value: field.minLength,
                            message: `Minimum ${field.minLength} caractères requis`
                          } : undefined,
                          pattern: field.pattern
                        }}
                        render={({ field: fieldProps }) => {
                          if (field.type === 'select' && field.options) {
                            const isArray = Array.isArray(fieldProps.value);
                            return (
                              <select
                                value={isArray ? fieldProps.value[0] : fieldProps.value}
                                onChange={(e) => {
                                  if (isArray) {
                                    fieldProps.onChange([e.target.value]);
                                  } else {
                                    fieldProps.onChange(e.target.value);
                                  }
                                }}
                                id={field.name}
                                disabled={field.disabled}
                                className={`mt-1 block w-full border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                              >
                                {field.options.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            );
                          }
                          
                          return (
                            <input
                              {...fieldProps}
                              type={field.type}
                              id={field.name}
                              disabled={field.disabled}
                              className={`mt-1 block w-full border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                              autoComplete={field.type === 'password' ? 'new-password' : 'off'}
                            />
                          );
                        }}
                      />
                      {errors[field.name as string] && (
                        <p className="mt-1 text-sm text-red-600">
                          {String(errors[field.name as string]?.message || "Ce champ est invalide")}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
          </div>
          
          <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
              style={{ backgroundColor: 'transparent' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </span>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntityForm;