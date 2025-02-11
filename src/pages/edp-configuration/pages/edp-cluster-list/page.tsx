import React from 'react';
import { PageLogicWrapper } from '../../../../components/PageLogicWrapper';
import { DialogContextProvider } from '../../../../providers/Dialog';
import { NamespacesGuardWrapper } from '../../../../providers/NamespacesGuardWrapper';
import { PageView } from './view';

export default function () {
    return (
        <PageLogicWrapper>
            <DialogContextProvider>
                <NamespacesGuardWrapper>
                    <PageView />
                </NamespacesGuardWrapper>
            </DialogContextProvider>
        </PageLogicWrapper>
    );
}
