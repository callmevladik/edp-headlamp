import React from 'react';
import { PageLogicWrapper } from '../../components/PageLogicWrapper';
import { DialogContextProvider } from '../../providers/Dialog';
import { FilterContextProvider } from '../../providers/Filter';
import { NamespacesGuardWrapper } from '../../providers/NamespacesGuardWrapper';
import { PageView } from './view';

export default function () {
    return (
        <PageLogicWrapper>
            <DialogContextProvider>
                <FilterContextProvider>
                    <NamespacesGuardWrapper>
                        <PageView />
                    </NamespacesGuardWrapper>
                </FilterContextProvider>
            </DialogContextProvider>
        </PageLogicWrapper>
    );
}
