import React from 'react';
import {
  CrownOutlined,
} from '@ant-design/icons'

import { IPlugin } from '@veramo-community/agent-explorer-plugin';
import { Kudos } from './Kudos';
import { UniqueVerifiableCredential } from '@veramo/core';
import { KudosCredential } from './KudosCredential';

const Plugin: IPlugin = {
    //@ts-ignore
    init: () => {
        return {
          name: 'Kudos',
          description: 'Explore and give kudos',
          icon: <CrownOutlined />,
          requiredMethods: [],
          routes: [
            {
              path: '/kudos',
              element: <Kudos />,
            },
          ],
          menuItems: [
            {
              name: 'Kudos',
              path: '/kudos',
              icon: <CrownOutlined />,
            },
          ],
          getCredentialComponent: (credential: UniqueVerifiableCredential) => {
            if (credential.verifiableCredential.type?.includes('Kudos')) {
              return KudosCredential
            }
            return undefined
          },

        }
    }
};

export default Plugin;