import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Form, Input, Select, theme, } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifier } from '@veramo/core'
import { IIdentifierProfile } from './types'
import IdentifierProfile from './IdentifierProfile'
import { DownOutlined } from '@ant-design/icons'

const { Option } = Select

export interface ComposeKudosFormValues {
  issuer: string
  subject: string
  kudos: string
}

interface ComposeKudosFormFormProps {
  onNewKudos: (values: ComposeKudosFormValues) => void
}

export const ComposeKudosForm: React.FC<ComposeKudosFormFormProps> = ({
  onNewKudos,
}) => {
  const { agent } = useVeramo()
  const { token } = theme.useToken()
  const [form] = Form.useForm()
  const issuer = Form.useWatch('issuer', {form, preserve:true });
  const subject = Form.useWatch('subject', {form, preserve:true });
  const [issuerProfile, setIssuerProfile] = useState<IIdentifierProfile>()

  const [managedIdentifiers, setManagedIdentifiers] = useState<
    IIdentifier[]
  >([])
  const [
    managedIdentifiersWithProfiles,
    setManagedIdentifiersWithProfiles,
  ] = useState<IIdentifierProfile[]>([])

  
  useQuery(
    ['identifiers', { id: agent?.context.id }],
    () => agent?.didManagerFind(),
    {
      onSuccess: (data: IIdentifier[]) => {
        if (data) {
          setManagedIdentifiers(data)
          form.setFieldValue('issuer', data[0].did);
        }
      },
    },
  )

  useEffect(() => {
    if (agent) {
      Promise.all(
        managedIdentifiers.map((identifier) => {
          return agent.getIdentifierProfile({ did: identifier.did })
        }),
      )
        .then((profiles) => {
          setIssuerProfile(profiles[0])
          setManagedIdentifiersWithProfiles(profiles)
        })
        .catch(console.log)
    }
  }, [managedIdentifiers, agent])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onNewKudos(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }
  return (

      <Form
        form={form}
        layout="inline"
        name="form_in_form"
        initialValues={{
        }}
        style={{ 
          width: '100%', 
          paddingBottom: token.paddingContentVertical, 
          marginLeft: token.controlPaddingHorizontal, 
          marginRight: token.controlPaddingHorizontal,
        }}
      >

        <Form.Item name="issuer" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="subject" label='To'>
          <Input placeholder='did:example:123' />
        </Form.Item>

        <Form.Item name="kudos" label="Kudos">
          <Input placeholder='Thank you!'/>
        </Form.Item>
          {/* <Button onClick={handleOk} type='primary'>Kive kudos from:</Button> */}
        <Form.Item>

          {managedIdentifiersWithProfiles.length > 0 && (
          <Dropdown.Button
            // overlayStyle={{ height: '50px' }}
            type='primary'
            onClick={handleOk}
            icon={<Avatar size={'small'} src={issuerProfile?.picture} />}
            menu={{
              items: [
                ...managedIdentifiersWithProfiles.map((profile) => {
                  return {
                    key: profile.did,
                    onClick: () => {
                      setIssuerProfile(profile)
                      form.setFieldValue('issuer', profile.did)
                    },
                    label: <IdentifierProfile did={profile.did} />,
                  }
                }),
              ],
              selectable: true,
              defaultSelectedKeys: [issuer],
            }}
          >
            Give kudos as
          </Dropdown.Button>
        )}
                </Form.Item>


      </Form>

  )
}
