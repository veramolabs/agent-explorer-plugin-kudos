import React, { useEffect, useState } from 'react'
import { Avatar, Dropdown, Form, Input, Select, theme, } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifier, TAgent } from '@veramo/core'
import { ActionButton, DIDDiscoveryBar } from '@veramo-community/agent-explorer-plugin'

const { Option } = Select

export interface ComposeKudosFormValues {
  issuer: string
  subject: string
  kudos: string
}

interface ComposeKudosFormFormProps {
  onNewKudos: (values: ComposeKudosFormValues, agent: any) => void
}

export const ComposeKudosForm: React.FC<ComposeKudosFormFormProps> = ({
  onNewKudos,
}) => {
  const { agent } = useVeramo()
  const { token } = theme.useToken()
  const [form] = Form.useForm()

  const handleOk = (did: string, agent: any) => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onNewKudos({
          ...values,
          issuer: did,
        }, agent)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }
  return (

      <Form
        form={form}
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

        <Form.Item name="subject" hidden/>
        <Form.Item label="To">
        <DIDDiscoveryBar handleSelect={(did: string) => {
          form.setFieldsValue({subject: did})
        }} />
        </Form.Item>
        <Form.Item name="kudos" label="Kudos">
          <Input placeholder='Thank you!'/>
        </Form.Item>

        <ActionButton onAction={handleOk} title='Give kudos and save to:'/>
      </Form>

  )
}
