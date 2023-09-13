import React from 'react';
import {
  CrownOutlined,
} from '@ant-design/icons'

import { IPlugin } from './types';
import { Kudos } from './Kudos';

const Plugin: IPlugin = {
    init: () => {
        return {
          name: 'Kudos',
          description: 'Explore and give kudos',
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
          
        }
    }
};

export default Plugin;