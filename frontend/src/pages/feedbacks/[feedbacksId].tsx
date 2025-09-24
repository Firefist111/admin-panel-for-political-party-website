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

import { update, fetch } from '../../stores/feedbacks/feedbacksSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditFeedbacks = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'name': '',

    'email': '',

    message: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { feedbacks } = useAppSelector((state) => state.feedbacks)

  const { feedbacksId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: feedbacksId }))
  }, [feedbacksId])

  useEffect(() => {
    if (typeof feedbacks === 'object') {
      setInitialValues(feedbacks)
    }
  }, [feedbacks])

  useEffect(() => {
      if (typeof feedbacks === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (feedbacks)[el])

          setInitialValues(newInitialVal);
      }
  }, [feedbacks])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: feedbacksId, data }))
    await router.push('/feedbacks/feedbacks-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit feedbacks')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit feedbacks'} main>
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
        label="Name"
    >
        <Field
            name="name"
            placeholder="Name"
        />
    </FormField>

    <FormField
        label="Email"
    >
        <Field
            name="email"
            placeholder="Email"
        />
    </FormField>

    <FormField label="Message" hasTextareaHeight>
        <Field name="message" as="textarea" placeholder="Message" />
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/feedbacks/feedbacks-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditFeedbacks.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditFeedbacks
