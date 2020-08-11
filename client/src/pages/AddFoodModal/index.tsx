import { Formik, FormikProps } from 'formik'
import React, { FunctionComponent, ReactNode } from 'react'
import * as yup from 'yup'
import './styles.css'

const validationSchema = yup.object({
    dessert: yup.string().required(),
    calories: yup.number().min(0).required(),
    fat: yup.number().min(0).required(),
    carb: yup.number().min(0).required(),
    protein: yup.number().min(0).required(),
})

type NutritionFormProps = {
    dessert: string,
    calories: string,
    fat: string,
    carb: string,
    protein: string,
}



export const AddFoodModal: FunctionComponent<{onSubmit: (values: NutritionListEntry)=>any}> = ({onSubmit}) => {
    return (
        <div className="pa2 bg-white" data-testId="AddFoodModal">
            <div className="bg-gold pa2 white fw6">
                <i className="fa fa-exclamation-triangle ma2" aria-hidden="true"></i>
                Please fill all details before you submit
            </div>
            <div>
                <Formik
                    initialValues={{
                        dessert: '',
                        calories: '',
                        fat: '',
                        carb: '',
                        protein: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values) => onSubmit({
                            dessert: values.dessert,
                            nutritionInfo: {
                                calories: Number.parseInt(values.calories),
                                fat: Number.parseInt(values.fat),
                                carb: Number.parseInt(values.carb),
                                protein: Number.parseInt(values.protein),
                            },
                        })
                    }
                >
                    {(formikProps: FormikProps<NutritionFormProps>): ReactNode => {                        

                        return (
                            <form onSubmit={formikProps.handleSubmit}>
                                <div className="flex flex-column">
                                    <label>Dessert Name*</label>
                                    <input name="dessert"
                                        data-testId="DessertNameInput"
                                        onChange={formikProps.handleChange}
                                        onBlur={formikProps.handleBlur} />
                                    <div className="red">{formikProps.touched['dessert'] && formikProps.errors['dessert']}&nbsp;</div>

                                    <label>Calories*</label>
                                    <input name="calories"
                                        data-testId="CaloriesInput"
                                        onChange={formikProps.handleChange}
                                        onBlur={formikProps.handleBlur} />
                                    <div className="red">{formikProps.touched['calories'] && formikProps.errors['calories']}&nbsp;</div>

                                    <label>Fat*</label>
                                    <input name="fat"
                                        data-testId="FatInput"
                                        onChange={formikProps.handleChange}
                                        onBlur={formikProps.handleBlur} />
                                    <div className="red">{formikProps.touched['fat'] && formikProps.errors['fat']}&nbsp;</div>

                                    <label>Carbs*</label>
                                    <input name="carb"
                                        data-testId="CarbInput"
                                        onChange={formikProps.handleChange}
                                        onBlur={formikProps.handleBlur} />
                                    <div className="red">{formikProps.touched['carb'] && formikProps.errors['carb']}&nbsp;</div>

                                    <label>Protein*</label>
                                    <input name="protein"
                                        data-testId="ProteinInput"
                                        onChange={formikProps.handleChange}
                                        onBlur={formikProps.handleBlur} />
                                    <div className="red">{formikProps.touched['protein'] && formikProps.errors['protein']}&nbsp;</div>

                                    <button
                                        data-testId="SubmitButton"
                                        className={
                                            'white f6 link br1 ph3 pv2 mb2 dib white bg-dark-green ba b--blue bw2 fw6 ' +
                                            ((formikProps.dirty && formikProps.isValid) ? 'dim' : 'disabled')
                                        }
                                        disabled={!formikProps.dirty || !formikProps.isValid}
                                    >
                                        <i className="fa fa-check mr2" aria-hidden="true"></i>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}