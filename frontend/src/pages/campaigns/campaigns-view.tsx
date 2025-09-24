import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/campaigns/campaignsSlice'
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

const CampaignsView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { campaigns } = useAppSelector((state) => state.campaigns)

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
              <title>{getPageTitle('View campaigns')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View campaigns')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/campaigns/campaigns-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Title</p>
                    <p>{campaigns?.title}</p>
                </div>

                <div className={'mb-4'}>
                  <p className={'block font-bold mb-2'}>Description</p>
                  {campaigns.description
                    ? <p dangerouslySetInnerHTML={{__html: campaigns.description}}/>
                    : <p>No data</p>
                  }
                </div>

                <FormField label='StartDate'>
                    {campaigns.start_date ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={campaigns.start_date ?
                        new Date(
                          dayjs(campaigns.start_date).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No StartDate</p>}
                </FormField>

                <FormField label='EndDate'>
                    {campaigns.end_date ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={campaigns.end_date ?
                        new Date(
                          dayjs(campaigns.end_date).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No EndDate</p>}
                </FormField>

                <>
                    <p className={'block font-bold mb-2'}>Events Campaign</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Name</th>

                                <th>Date</th>

                                <th>Location</th>

                            </tr>
                            </thead>
                            <tbody>
                            {campaigns.events_campaign && Array.isArray(campaigns.events_campaign) &&
                              campaigns.events_campaign.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/events/events-view/?id=${item.id}`)}>

                                    <td data-label="name">
                                        { item.name }
                                    </td>

                                    <td data-label="date">
                                        { dataFormatter.dateTimeFormatter(item.date) }
                                    </td>

                                    <td data-label="location">
                                        { item.location }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!campaigns?.events_campaign?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/campaigns/campaigns-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

CampaignsView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default CampaignsView;
