import React, { useState } from 'react'
import { formatRelative, set } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer, ProList } from '@ant-design/pro-components'
import { VerifiableCredential } from '@veramo-community/react-components'
import { IDataStore, IDataStoreORM, UniqueVerifiableCredential } from '@veramo/core'
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import IdentifierProfile from './IdentifierProfile'
import { getIssuerDID } from './utils/did'
import CredentialActionsDropdown from './CredentialActionsDropdown'
import { App, Button } from 'antd'
import { ComposeKudosForm, ComposeKudosFormValues } from './ComposeKudosForm'

export const Kudos = () => {
  const navigate = useNavigate()
  const { agent } = useVeramo<IDataStoreORM & IDataStore>()
  const { notification } = App.useApp()

  const { data: credentials, isLoading, refetch } = useQuery(
    ['credentials', { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [{ column: 'type', value: ['VerifiableCredential,Kudos'] }],
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
      }),
  )

  const handleNewKudos = async (values: ComposeKudosFormValues) => {
    const issuerProfile = await agent?.getIdentifierProfile({ did: values.issuer })
    const subjectProfile = await agent?.getIdentifierProfile({ did: values.subject })

    const credential = await agent?.createVerifiableCredential({
      save: true,
      proofFormat: 'jwt',
      credential: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'Kudos'],
        issuer: { id: values.issuer },
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: values.subject,
          name: subjectProfile?.name,
          avatar: subjectProfile?.picture,
          kudos: values.kudos,
          
          "authorId": issuerProfile?.did,
          "authorName": issuerProfile?.name,
          "authorAvatar": issuerProfile?.picture,
          
          "channelId": "878293684620234755",
          "channelName": "💬｜general-chats",
          "guildId": "878293684620234752",
          "guildName": "Veramolabs",
          "guildAvatar": "https://cdn.discordapp.com/icons/878293684620234752/3a6e2e86c563b4f327e86d51289dd294.png",

        },
      },
    })

    if (credential) {
      await agent?.dataStoreSaveVerifiableCredential({verifiableCredential: credential})
      notification.success({
        message: 'Kudos sent',
      })
      refetch()
      
    }
  }

  return (
    <PageContainer>
      <ComposeKudosForm
        onNewKudos={handleNewKudos}
      />
      <ProList
        ghost
        loading={isLoading}
        pagination={{
          defaultPageSize: 10,
        }}
        grid={{ column: 1, lg: 1, xxl: 1, xl: 1 }}
        onItem={(record: any) => {
          return {
            onClick: () => {
              navigate('/credentials/' + record.hash)
            },
          }
        }}
        metas={{
          title: {},
          content: {},
          actions: {
            cardActionProps: 'extra',
          },
        }}
        dataSource={credentials?.map((item: UniqueVerifiableCredential) => {
          return {
            title: (
              <IdentifierProfile did={getIssuerDID(item.verifiableCredential)} />
            ),
            actions: [
              <div>
                {formatRelative(
                  new Date(item.verifiableCredential.issuanceDate),
                  new Date(),
                )}
              </div>,
              <CredentialActionsDropdown credential={item.verifiableCredential}>
                <Button type="text">
                  <EllipsisOutlined />
                </Button>
              </CredentialActionsDropdown>,
            ],
            content: (
              <div style={{ width: '100%' }}>
                <VerifiableCredential credential={item.verifiableCredential} />
              </div>
            ),
            hash: item.hash,
          }
        })}
      />
    </PageContainer>
  )
}


