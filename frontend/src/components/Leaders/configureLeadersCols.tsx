import React from 'react';
import BaseIcon from '../BaseIcon';
import { mdiEye, mdiTrashCan, mdiPencilOutline } from '@mdi/js';
import axios from 'axios';
import {
    GridActionsCellItem,
    GridRowParams,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import dataFormatter from '../../helpers/dataFormatter'
import DataGridMultiSelect from "../DataGridMultiSelect";
import ListActionsPopover from '../ListActionsPopover';
type Params = (id: string) => void;

export const loadColumns = async (
    onDelete: Params,
    entityName: string,
) => {
    async function callOptionsApi(entityName: string) {
        try {
        const data = await axios(`/${entityName}/autocomplete?limit=100`);
        return data.data;
        } catch (error) {
         console.log(error);
         return [];
        }
    }
    return [

        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',

            editable: true,

        },

        {
            field: 'position',
            headerName: 'Position',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',

            editable: true,

        },

        {
            field: 'bio',
            headerName: 'Biography',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',

            editable: true,

        },

        {
            field: 'photo',
            headerName: 'Photo',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',

            editable: true,

        },

        {
            field: 'actions',
            type: 'actions',
            minWidth: 30,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
            getActions: (params: GridRowParams) => {

               return [
                   <div key={params?.row?.id}>
                      <ListActionsPopover
                      onDelete={onDelete}
                      itemId={params?.row?.id}
                      pathEdit={`/leaders/leaders-edit/?id=${params?.row?.id}`}
                      pathView={`/leaders/leaders-view/?id=${params?.row?.id}`}
                      hasUpdatePermission={true}
                    />
                   </div>,
                  ]
            },
        },
    ];
};
