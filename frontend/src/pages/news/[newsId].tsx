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

import { update, fetch } from '../../stores/news/newsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditNews = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'headline': '',

    content: '',

    published_date: new Date(),

    category: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { news } = useAppSelector((state) => state.news)

  const { newsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: newsId }))
  }, [newsId])

  useEffect(() => {
    if (typeof news === 'object') {
      setInitialValues(news)
    }
  }, [news])

  useEffect(() => {
      if (typeof news === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (news)[el])

          setInitialValues(newInitialVal);
      }
  }, [news])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: newsId, data }))
    await router.push('/news/news-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit news')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit news'} main>
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
        label="Headline"
    >
        <Field
            name="headline"
            placeholder="Headline"
        />
    </FormField>

    <FormField label='Content' hasTextareaHeight>
        <Field
            name='content'
            id='content'
            component={RichTextField}
        ></Field>
    </FormField>

      <FormField
          label="PublishedDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.published_date ?
                  new Date(
                      dayjs(initialValues.published_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'published_date': date})}
          />
      </FormField>

    <FormField label="Category" labelFor="category">
        <Field name="category" id="category" component="select">

            <option value="Development">Development</option>

            <option value="Activities">Activities</option>

            <option value="PressReleases">PressReleases</option>

        </Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/news/news-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditNews.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditNews
