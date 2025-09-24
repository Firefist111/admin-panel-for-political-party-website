import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/leaders/leadersSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const LeadersView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { leaders } = useAppSelector((state) => state.leaders)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View leaders')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View leaders')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/leaders/leaders-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Name</p>
                    <p>{leaders?.name}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Position</p>
                    <p>{leaders?.position}</p>
                </div>

                <div className={'mb-4'}>
                  <p className={'block font-bold mb-2'}>Biography</p>
                  {leaders.bio
                    ? <p dangerouslySetInnerHTML={{__html: leaders.bio}}/>
                    : <p>No data</p>
                  }
                </div>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/leaders/leaders-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

LeadersView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default LeadersView;
