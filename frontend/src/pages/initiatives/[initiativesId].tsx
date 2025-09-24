import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/initiatives/initiativesSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditInitiatives = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'title': '',

    description: '',

    category: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { initiatives } = useAppSelector((state) => state.initiatives)

  const { initiativesId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: initiativesId }))
  }, [initiativesId])

  useEffect(() => {
    if (typeof initiatives === 'object') {
      setInitialValues(initiatives)
    }
  }, [initiatives])

  useEffect(() => {
      if (typeof initiatives === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (initiatives)[el])

          setInitialValues(newInitialVal);
      }
  }, [initiatives])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: initiativesId, data }))
    await router.push('/initiatives/initiatives-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit initiatives')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit initiatives'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="Title"
    >
        <Field
            name="title"
            placeholder="Title"
        />
    </FormField>

    <FormField label='Description' hasTextareaHeight>
        <Field
            name='description'
            id='description'
            component={RichTextField}
        ></Field>
    </FormField>

    <FormField label="Category" labelFor="category">
        <Field name="category" id="category" component="select">

            <option value="WomenEmpowerment">WomenEmpowerment</option>

            <option value="Infrastructure">Infrastructure</option>

            <option value="LocalInitiatives">LocalInitiatives</option>

        </Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/initiatives/initiatives-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditInitiatives.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditInitiatives
